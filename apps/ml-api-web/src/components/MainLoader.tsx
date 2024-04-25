import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Logo from '../svgs/Logo';

const MainLoader: React.FC = () => {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div>
                <Logo />
                <LinearProgress color="primary" />
            </div>
        </div>
    );
};

export default MainLoader;
