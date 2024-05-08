import React from 'react';
import { AppTheme } from '../theme';
import { useTheme } from '@mui/material';
type Props = {
    marginTop?: number | string;
    marginBottom?: number | string;
};
export const Divider: React.FC<Props> = ({ marginTop = '80px', marginBottom = '80px' }) => {
    const theme: AppTheme = useTheme();
    return (
        <div
            style={{
                margin: `${marginTop} 0px ${marginBottom}`,
                height: '1px',
                background: theme.colors.lightPeriwinkle,
            }}
        />
    );
};
