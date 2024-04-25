import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        minHeight: '500px',
        width: '100%',
        textAlign: 'center',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#97979796',
        fontSize: '22px',
        lineHeight: '29px',
        color: '#000000',
        borderRadius: 10,
        '& .heading': {
            color: 'red',
            fontWeight: '400',
            fontSize: '50px',
            lineHeight: '86px',
        },
    },
});
interface Props {
    message: string;
}

const NoDataAvailable = ({ message }: Props) => {
    const classes = useStyles({});

    return (
        <div className={classes.root}>
            <span className="heading"> {message}</span>Check back soon.
        </div>
    );
};
export default NoDataAvailable;
