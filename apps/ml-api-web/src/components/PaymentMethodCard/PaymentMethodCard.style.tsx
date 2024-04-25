import styled from 'styled-components';

export const PaymentMethodCardStyled = styled.div`
    display: flex;

    width: 100%;
    height: 100px;
    border-radius: 10px;
    background-color: #dfe1e654;
    margin-right: 2%;
    justify-content: space-between;

    .top-container {
        display: flex;
        flex-direction: column;
        width: 80%;
        padding-bottom: 10px;
    }

    .heading {
        font-family: lato;
        padding: 10px 15px 5px;
        font-weight: 700;
        font-size: 10px;
        letter-spacing: 0.5px;
        color: #fa6400;
    }

    .text {
        font-family: lato;
        display: flex;
        flex-direction: column;
        padding: 5px 15px;
        font-size: 14px;
        line-height: 16.8px;
        color: #000000;
    }

    .button {
        font-family: lato;
        background-color: #282828;
        color: white;
        width: 115px;
        height: 48px;
        margin: auto;
        font-weight: 400;
        font-size: 14px;
        border-radius: 4px;
        color: #fff;
        & span {
            margin: 0;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            font-size: 15px;
            line-height: 18px;
            text-align: center;
            letter-spacing: 1.25px;
            color: #fff;
        }

        &:hover {
            background: #000000;
        }
    }
`;
