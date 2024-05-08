export class InformPrrErrors {
    static notFound = (id: string): string => {
        return `Kid with id: ${id} not found.`;
    };

    static parentNotFound = (id: string): string => {
        return `Parent not found for kid '${id}'.`;
    };

    static activityNotFound(eventId: string) {
        return `Activity not found for event '${eventId}'.`;
    }
}
