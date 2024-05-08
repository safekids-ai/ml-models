import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Props } from './Notification.types';

export const Notification = ({ open, type, message, onClose }: Props) => (
    <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={onClose}>
        <Alert severity={type} onClose={onClose}>
            {message}
        </Alert>
    </Snackbar>
);
