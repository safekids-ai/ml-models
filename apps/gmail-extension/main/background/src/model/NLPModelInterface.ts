export interface NLPModelInterface {
    isHate(text: string): Promise<boolean>;
    version(): string;
}
