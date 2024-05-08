export enum Statuses {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    DELETED = 'DELETED',
    INACTIVE = 'INACTIVE',
    IN_PROGRESS = 'IN_PROGRESS',
    PENDING = 'PENDING',
    CONNECTED = 'CONNECTED',
    NOT_CONNECTED = 'NOT_CONNECTED',
}
export const defaultStatuses = [
    { id: Statuses.ACTIVE, status: 'ACTIVE' },
    { id: Statuses.INACTIVE, status: 'INACTIVE' },
    { id: Statuses.PENDING, status: 'PENDING' },
    { id: Statuses.DELETED, status: 'DELETED' },
    { id: Statuses.IN_PROGRESS, status: 'IN_PROGRESS' },
    { id: Statuses.COMPLETED, status: 'COMPLETED' },
];