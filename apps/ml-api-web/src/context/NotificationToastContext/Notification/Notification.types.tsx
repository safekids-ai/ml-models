export type Props = {
    open: boolean;
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    onClose: () => void;
};
