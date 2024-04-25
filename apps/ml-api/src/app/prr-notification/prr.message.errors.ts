export class PrrMessageErrors {
    static onUpdateNotificationStatus = (): string => {
        return 'Could not update notification status:';
    };

    static onDeleteFromQueue = (): string => {
        return 'Could not delete message from queue:';
    };

    static onFetchMessages = (): string => {
        return 'Could not fetch message from queue:';
    };

    static onFetchMessage = (messageId?: string): string => {
        return `A message with id :${messageId} could not found.`;
    };

    static invalidDate = (): string => {
        return `One of the input dates is invalid.`;
    };

    static notFound = (id: string): string => {
        return `Notification with id: ${id} not found.`;
    };

    static onUpload = (): string => {
        return 'Could not add message to queue:';
    };
}
