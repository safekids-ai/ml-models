export class FilteredUrlErrors {
    static alreadyExists = (url: string): string => {
        return `Url [${url}] already exists in allowed list`;
    };

    static alreadySent = (): string => {
        return `A similar request was already sent to your adult.`;
    };
}
