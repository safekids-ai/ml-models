export enum JobStatus {
    COMPLETED = 'COMPLETED',
    STARTED = 'STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    FAILED = 'FAILED',
}

export enum JobRemarks {
    COMPLETED = 'Job has been completed successful.',
    STARTED = 'Job has been started successful.',
    IN_PROGRESS = 'Job is in progress.',
    FAILED = 'Job has been failed.',
}

export class JobStatusDTO {
    status: JobStatus;
    remarks: string;
    startDate?: Date;
    endDate?: Date;
}
