import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Props } from './Notification.types';

export const Notification = ({ open, type, message, onClose }: Props) => (
    <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={onClose}>
        <Alert severity={type} onClose={onClose}>
            {message}
        </Alert>
    </Snackbar>
);
