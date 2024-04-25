import React, { useContext, useState } from 'react';
import { Notification } from './Notification/Notification';
import { NotificationObj } from './NotificationToastContext.type';

export const NotificationToastContext = React.createContext({
    showNotification: (obj: NotificationObj) => {},
});

type NotificationToastProviderParams = {
    children: React.ReactNode
}

export const NotificationToastProvider: React.FC<NotificationToastProviderParams> = (props: NotificationToastProviderParams) => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'success' | 'info' | 'warning' | 'error'>('info');
    const [message, setMessage] = useState('');

    const showNotification = (obj: NotificationObj) => {
        setOpen(true);
        setMessage(obj.message);
        setType(obj.type);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <NotificationToastContext.Provider value={{ showNotification }}>
            <Notification open={open} message={message} type={type} onClose={handleClose} />
            {props.children}
        </NotificationToastContext.Provider>
    );
};

export const useNotificationToast = () => useContext(NotificationToastContext);
