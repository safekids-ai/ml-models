export class SubscriptionErrors {
    static exists = (accountId: string): string => {
        return `User with account : ${accountId} already has subscription.`;
    };

    static notExists = (id: string): string => {
        return `No plan exists with id : ${id} .`;
    };
}
