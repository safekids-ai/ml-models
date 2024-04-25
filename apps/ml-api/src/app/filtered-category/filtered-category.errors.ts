export class FilteredCategoryErrors {
    static notFound = (id: string): string => {
        return `No category found for id: ${id}.`;
    };
}
