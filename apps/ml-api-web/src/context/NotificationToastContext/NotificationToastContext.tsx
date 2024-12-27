import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification } from './Notification/Notification';
import { NotificationObj } from './NotificationToastContext.type';

// Define the context interface
interface NotificationToastContextType {
  showNotification: (obj: NotificationObj) => void;
}

// Create the context with a default value
export const NotificationToastContext = createContext<NotificationToastContextType>({
  showNotification: () => {}, // Default implementation does nothing
});

interface NotificationToastProviderProps {
  children: ReactNode; // Typing for children
}

export const NotificationToastProvider: React.FC<NotificationToastProviderProps> = ({ children }) => {
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
      {children}
    </NotificationToastContext.Provider>
  );
};

// Custom hook for consuming the context
export const useNotificationToast = () => {
  return useContext(NotificationToastContext);
};
