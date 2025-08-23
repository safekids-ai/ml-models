async function createWorker(): Promise<Worker> {
  // Fetch the worker JavaScript file as text
  const response = await fetch(chrome.runtime.getURL("/worker/onnx/worker.js"));
  const workerScript = await response.text();

  // Create a Blob containing the worker script
  const blob = new Blob([workerScript], { type: "application/javascript" });

  // Create a Blob URL
  const workerURL = URL.createObjectURL(blob);

  // Create a new Worker using the Blob URL
  return new Worker(workerURL);
}

class ModelWorker {
  private worker: Worker | null = null;

  constructor() {
  }

  async initWorker() {
    this.worker = await createWorker();
    console.log("Created the worker")
    this.worker.onmessage = (event: MessageEvent) => {
      if (event.data.type === "modelLoaded") {
        console.log("ONNX model successfully loaded in Web Worker");
      } else if (event.data.type === "modelAlreadyLoaded") {
        console.log("ONNX model was already loaded.");
      } else if (event.data.type === "error") {
        console.error("Worker Error:", event.data.message);
      }
    };

    // Load the model when initializing
    await this.loadModel();
  }

  async loadModel(): Promise<void> {
    this.worker?.postMessage({ type: "loadModel" });
  }

  async infer(input: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject("Worker is not initialized.");
        return;
      }

      this.worker.postMessage({ type: "infer", input });

      this.worker.onmessage = (event: MessageEvent) => {
        if (event.data.type === "result") {
          resolve(event.data.result);
        } else if (event.data.type === "error") {
          reject(event.data.message);
        }
      };
    });
  }
}

// Initialize the model worker in the content script
(async () => {
  const model = new ModelWorker();
  await model.initWorker()

  // Example: Run inference
  try {
    const input = [1.0, 2.0, 3.0, 4.0]; // Adjust as needed
    const result = await model.infer(input);
    console.log("Inference result:", result);
  } catch (error) {
    console.error("Inference failed:", error);
  }
})();
