import React from 'react';
import styled from 'styled-components';
import Footer from '../../components/Footer';
import Logo from '../../svgs/Logo';
import Login from './Login/Login';

const Root = styled.div`
    min-height: inherit;
    height: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    background: white;
    padding: 40px 90px 40px 120px;
    justify-content: space-between;
`;

const SchoolSignIn = () => {
    return (
        <Root>
            <a href="https://www.safekids.ai">
                <Logo />
            </a>
            <Login />
            <Footer anchorColor="#f7274a" />
        </Root>
    );
};

export default SchoolSignIn;
