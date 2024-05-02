import React, { ReactNode } from 'react';
import { Typography, useTheme } from '@mui/material';
import {makeStyles} from '@mui/styles'
import { CSSProperties } from '@mui/styles/withStyles';

import { isSomething } from '../utils/helpers';
import Header from './Header';

import BackButton from './BackButton';
import { AppTheme } from '../theme';
import { useMobile } from '../utils/hooks';
import Footer from './Footer';

type StyleProps = Props & { isMobile: boolean };
const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 'inherit',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    grid: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column-reverse',
            '& $main': {
                width: '80%',
                margin: '0 auto',
            },
        },
    },
    main: ({ wrapperStyle }: StyleProps) => ({
        width: '38.5%',
        ...wrapperStyle,
        '& .back-button': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: '29px',
            fontSize: '13px',
            margin: 'auto',
            '& span': {
                marginLeft: '8px',
            },
        },
    }),
    content: {
        padding: ({ isMobile }: StyleProps) => (isMobile ? '0px 16px' : `0px 14% 0px 12%`),
        minHeight: 'calc(100vh - 180px)',
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .image': {
            width: '100%',
            height: '420px',
        },
        '& .subtitle': {
            marginTop: '6px',
            fontSize: '14px',
        },
    },
    formWrapper: {
        margin: '70px 0px 0px',
        '& .input-field': {
            marginTop: '15px',
        },
    },
    imageWrapper: {
        padding:'30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    terms: {
        marginTop: '44px',
        fontSize: '13px',
        textAlign: 'center',
    },
}));
type Props = {
    title: string | ReactNode;
    subtitle: string | ReactNode;
    content: ReactNode;
    terms: ReactNode;
    image: string;
    imageSize?: string;
    onBack?: () => void;
    wrapperStyle?: CSSProperties;
};
const FormPage: React.FC<Props> = (props) => {
    const { title, subtitle, content, terms, image, onBack } = props;
    const isMobile = useMobile();
    const classes = useStyles({ ...props, isMobile });
    const theme: AppTheme = useTheme();

    return (
        <div className={classes.root}>
            <Header />
            <div className={classes.content}>
                <div className={classes.grid}>
                    {!isMobile && (
                        <div className={classes.imageWrapper}>
                            <img src={image} alt="safeKids for Home" />
                        </div>
                    )}
                    <div className={classes.main}>
                        {isSomething(onBack) && onBack && (
                            <BackButton onClick={onBack} textColor="#fa6400" iconColor={theme.colors.text} className="back-button text-button" />
                        )}
                        <Typography variant="h4" className="title" align="center">
                            {title}
                        </Typography>
                        <div style={{ textAlign: 'center' }} className="subtitle">
                            {subtitle}
                        </div>
                        <div className={classes.formWrapper}>{content}</div>
                        <div className={classes.terms}>{terms} </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FormPage;
