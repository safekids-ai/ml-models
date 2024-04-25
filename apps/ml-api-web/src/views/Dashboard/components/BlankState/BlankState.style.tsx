import styled from 'styled-components';

export const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    & .heading {
        font-family: 'Merriweather';
        font-style: normal;
        font-weight: 900;
        font-size: 28px;
        line-height: 20px;
        color: #000;
    }
    & .red-text {
        color: #f7274a !important;
    }
    & .description {
        margin-top: 5px;
        font-family: 'Lato';
        font-size: 14px;
        font-weight: 400;
    }
`;
