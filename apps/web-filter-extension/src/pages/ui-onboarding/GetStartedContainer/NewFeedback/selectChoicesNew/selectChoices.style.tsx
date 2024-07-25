import styled, { css } from 'styled-components';

export const ChoicesContainer = styled.section`
    border-radius: 24px;
    background: #4a4a4a;
    display: flex;
    flex-direction: column;
    animation-name: onload-btn;
    animation-duration: 0.2s;
    .container {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid 1px #979797;
        font-family: 'Merriweather';
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 30px;
        letter-spacing: -0.1875px;
        color: #ffffff;
        padding: 19px 20px;
        img {
            width: 30px;
            height: 30px;
            background-size: cover;
        }
        .choice-text {
        }
    }
    .container:last-of-type {
        border-bottom: none;
    }
`;
