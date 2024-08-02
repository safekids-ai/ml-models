import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
type Props = {
    pathColor?: string;
    loaderColor?: string;
    width?: string;
    height?: string;
    primary?: boolean;
};
const useStyles = makeStyles((theme) => ({
    root: {
        border: ({ pathColor = 'rgba(255,255,255,0.4)' }: Props) => `2px solid ${pathColor}` /* Light grey */,
        borderTop: ({ loaderColor = '#fff' }: Props) => `2px solid ${loaderColor}` /* Blue */,
        borderRadius: '50%',
        width: ({ width = '24px' }: Props) => width,
        height: ({ height = '24px' }: Props) => height,
        animation: '$spin 2s linear infinite',
    },

    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
}));

const Loader: React.FC<Props> = (props: Props) => {
    const propsToOverwrite: Partial<Props> = {};
    if (props.primary) {
        propsToOverwrite.pathColor = 'rgba(247, 39, 74, 0.4)';
        propsToOverwrite.loaderColor = 'rgba(247, 39, 74, 1)';
    }
    const classes = useStyles({ ...props, ...propsToOverwrite });
    return <div className={classes.root} />;
};

export default Loader;
