export type Props = {
    nextStep?: () => void;
    isSettings?: boolean;
    showSync?: boolean;
};

export type DataType = {
    id?: string;
    hostUrl: string;
    accessKey: string;
    secret: string;
};
