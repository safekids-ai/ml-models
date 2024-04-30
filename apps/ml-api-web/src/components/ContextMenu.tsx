import React, { useState, useRef, useCallback } from 'react';
import { Popover, PopoverOrigin } from '@mui/material';
import {makeStyles} from '@mui/styles'
import MenuIcon from '@mui/icons-material/MoreVert';
import { AppTheme } from '../theme';

type Item = {
    icon: JSX.Element;
    title: string;
    onClick: () => void;
};
type Props = {
    anchorOrigin?: PopoverOrigin;
    items: Item[];
    iconProps?: any;
    transformOrigin?: PopoverOrigin;
    className?: string;
};

const useStyles = makeStyles((theme: AppTheme) => ({
    popover: {
        minWidth: '230px',
        padding: '15px',
    },
    popoverWrapper: {
        borderRadius: '6.9px',
        border: `1px solid ${theme.colors.lightPeriwinkle}`,
    },
    popoverItem: {
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f7f7f7',
        },
        '& .title': {
            marginLeft: '11px',
        },
    },
    contextMenu: {
        cursor: 'pointer',
        '& svg': {
            borderRadius: '50%',

            fill: theme.palette.primary.main,
            '&:hover': {
                background: theme.colors.veryLightBlue,
            },
        },
    },
}));

const ContextMenu = ({
    anchorOrigin = {
        vertical: 'center',
        horizontal: 'right',
    },
    items,
    iconProps,
    transformOrigin = {
        vertical: 'top',
        horizontal: 'left',
    },
    className = '',
}: Props) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const classes = useStyles();
    const onClick = useCallback(
        (item: Item) => () => {
            item.onClick();
            setOpen(false);
        },
        [setOpen],
    );
    return (
        <>
            <span className={`${classes.contextMenu} ${className}`}>
                <MenuIcon className="icon" onClick={() => setOpen((open) => !open)} ref={ref} {...iconProps} />
            </span>
            <Popover
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={ref.current}
                anchorOrigin={anchorOrigin}
                classes={{ paper: classes.popoverWrapper }}
                elevation={0}
                transformOrigin={transformOrigin}
            >
                <div className={classes.popover}>
                    {items.map((item, index) => {
                        return (
                            <div key={index} className={classes.popoverItem} onClick={onClick(item)}>
                                {item.icon}
                                <span className="title">{item.title} </span>
                            </div>
                        );
                    })}
                </div>
            </Popover>
        </>
    );
};
export default ContextMenu;
