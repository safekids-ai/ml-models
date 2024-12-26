import {Worker, Queue, Job} from 'bullmq';
import retry from 'async-retry';
import {LoggingService} from "../logger/logging.service";

type ProcessBatchFunction<T> = (jobs: Job<T>[]) => Promise<void> | void;

interface BatchProcessorOptions<T> {
  queue: Queue<T>;
  batchSize?: number;
  batchTimeout?: number;
  processBatch: ProcessBatchFunction<T>;
  workerCount?: number;
  retryOptions?: retry.Options;
}

class BatchProcessor<T> {
  private queue: Queue<T>;
  private batchSize: number;
  private batchTimeout: number;
  private processBatch: ProcessBatchFunction<T>;
  private batch: Job<T>[];
  private timer: NodeJS.Timeout | null;
  private workerCount: number;
  private retryOptions: retry.Options;

  constructor(
    private readonly log: LoggingService,
    {
      queue,
      batchSize = 10,
      batchTimeout = 1000,
      processBatch,
      workerCount = 1,
      retryOptions = {retries: 0},
    }: BatchProcessorOptions<T>
  ) {
    this.queue = queue;
    this.batchSize = batchSize;
    this.batchTimeout = batchTimeout;
    this.processBatch = processBatch;
    this.batch = [];
    this.timer = null;
    this.workerCount = workerCount;
    this.retryOptions = retryOptions;

    for (let i = 0; i < this.workerCount; i++) {
      this._createWorker(i + 1);
    }
  }

  private _createWorker(workerId: number) {
    new Worker<T>(this.queue.name, this._handleJob.bind(this), {
      connection: this.queue.opts.connection,
      lockDuration: 300000
    });
    this.log.info("Creating worker" + workerId)
    this.log.info(`Queue: ${this.queue.name} Worker ${workerId} started`);
  }

  private async _handleJob(job: Job<T>) {
    this.batch.push(job);

    if (this.batch.length >= this.batchSize) {
      // Batch is full, process it immediately
      await this._processBatchWithRetry();
    }

    // If the batch isn't full, ensure the timer is running
    if (!this.timer) {
      this.timer = setTimeout(async () => {
        this.timer = null; // Reset the timer
        await this._processBatchWithRetry();
      }, this.batchTimeout);
    }
  }

  private async _processBatchWithRetry() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.batch.length > 0) {
      let jobsToProcess = this.batch.slice();
      this.batch = [];

      // Store tokens for each job to use when extending the lock
      const jobTokens = jobsToProcess.map(job => job.token);

      const extendLockInterval = setInterval(() => {
        jobsToProcess.forEach((job, index) => job.extendLock(jobTokens[index], 30000));
      }, 30000); // Extend lock every 30 seconds

      try {
        await retry(
          async () => {
            const completionStatuses = await Promise.all(
              jobsToProcess.map(async (job) => await job.progress == 100)
            );
            jobsToProcess = jobsToProcess.filter(
              (_, index) => !completionStatuses[index]
            );

            if (jobsToProcess.length === 0) {
              this.log.debug(
                `Queue: ${this.queue.name} All jobs in the batch have already been processed. No work to do.`
              );
              return;
            }

            this.log.debug(
              `Queue: ${this.queue.name} Attempting to process batch: ${jobsToProcess
                .map((job) => job.id)
                .join(", ")}`
            );

            await this.processBatch(jobsToProcess);
            await Promise.all(
              jobsToProcess.map(async (job) => {
                await job.updateProgress(100);
              })
            );
          },
          {
            ...this.retryOptions,
            onRetry: (error, attempt) => {
              this.log.warn(
                `Queue: ${this.queue.name} Batch processing failed for jobs: ${jobsToProcess
                  .map((job) => job.id)
                  .join(", ")}. Retrying... (Attempt ${attempt})`,
                error
              );
            },
          }
        );
      } catch (error) {
        this.log.error(
          `Queue: ${this.queue.name} Batch processing failed for jobs: ${jobsToProcess
            .map((job) => job.id)
            .join(", ")} due to ${error}`
        );
        for (const job of jobsToProcess) {
          const isCompleted = await job.isCompleted();
          if (!isCompleted) {
            await job.moveToFailed(
              new Error(`Batch processing failed after retries ${error}`),
              job.token
            );
          }
        }
      } finally {
        clearInterval(extendLockInterval); // Ensure the interval is cleared after processing
      }
    }
  }


  public async flush() {
    await this._processBatchWithRetry();
  }
}

export {BatchProcessorOptions, BatchProcessor};
