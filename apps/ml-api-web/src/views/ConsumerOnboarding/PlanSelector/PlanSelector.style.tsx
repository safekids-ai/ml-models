import styled, { css } from 'styled-components';

interface ContentProps {
    isOnBoarding: boolean;
}

export const Title = styled.span<ContentProps>`
    display: flex;
    align-items: center;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: ${(props) => (props.isOnBoarding ? '28px' : '15px')};
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
`;
export const Root = styled.div<ContentProps>`
    display: flex;
    flex-direction: column;
    position: relative;
    .card-container {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
    }
    .plan-container {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        max-width: 1000px;
    }
`;
