import React from 'react';
import { BackIcon } from '../svgs/DashboardIcons';
import { makeStyles, Button } from '@mui/material';

type Props = {
    className?: string;
    onClick: () => void;
    iconColor?: string;
    textColor?: string;
};
const useStyles = makeStyles((theme) => ({
    root: {
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        cursor: 'pointer',
        color: ({ textColor }: Props) => textColor || theme.palette.text.primary,
        '& svg': {
            color: ({ iconColor }: Props) => iconColor || theme.palette.primary.main,
            marginRight: '4px',
            width: '24px',
            height: '24px',
        },
    },
}));
const BackButton = (props: Props) => {
    const { onClick, className } = props;
    const classes = useStyles(props);
    return (
        <Button className={`${classes.root} ${className}`} onClick={onClick}>
            <BackIcon /> Back
        </Button>
    );
};
export default BackButton;
