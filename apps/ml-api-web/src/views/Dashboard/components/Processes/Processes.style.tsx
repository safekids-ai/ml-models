import styled from 'styled-components';

export const Root = styled.div`
    min-height: 530px;
    h4 {
        padding: 0;
        margin: 0 0 10px 0;
        display: flex;
        align-items: center;
        font-size: 15px;
        font-family: Merriweather, 'Roboto', 'Helvetica', 'Arial', sans-serif;
        font-weight: 900;
        line-height: 18px;
        letter-spacing: -0.25px;
        @media only screen and (min-width: 320px) and (max-width: 480px) {
            margin-left: 80px;
        }
    }
`;

export const LoadingContainer = styled.div`
    height: 500px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
        border-color: rgb(255, 255, 255) rgb(247 39 74) rgba(255, 255, 255, 0.4);
        border-width: 4px;
        width: 45px;
        height: 45px;
    }
`;
