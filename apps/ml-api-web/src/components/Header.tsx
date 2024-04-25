import React from 'react';

import { makeStyles } from '@material-ui/core';
import { useMobile } from '../utils/hooks';
import ConsumerLogo from './ConsumerLogo/ConsumerLogo';

type StyleProps = Props & { isMobile: boolean };
const useStyles = makeStyles({
    header: {
        padding: ({ marginRight, marginLeft }: StyleProps) => `55px ${marginRight} 0px ${marginLeft}`,
        margin: ({ isMobile }: StyleProps) => (isMobile ? '0 auto 16px' : '0'),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: ({ isMobile }: StyleProps) => (isMobile ? 'center' : 'flex-start'),
        alignItems: ({ isMobile }: StyleProps) => (isMobile ? 'center' : 'flex-start'),
    },
    schoolHeading: {
        height: '12px',
        fontFamily: 'Lato',
        fontSize: '10px',
        fontWeight: 'bold',
        fontStretch: 'normal',
        fontSStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: '7.5px',
        color: '#f7274A',
    },
});
type Props = {
    marginLeft?: string | number;
    marginRight?: string | number;
};
const Header: React.FC<Props> = ({ marginLeft = '12%', marginRight = '14%' }: Props) => {
    const isMobile = useMobile();
    const classes = useStyles({
        isMobile,
        marginLeft: isMobile ? '0' : marginLeft,
        marginRight: isMobile ? '0' : marginRight,
    });

    return <ConsumerLogo className={classes.header} />;
};
export default Header;
