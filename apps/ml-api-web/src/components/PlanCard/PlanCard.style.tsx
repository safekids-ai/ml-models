import styled from 'styled-components';

type Props = {
    active: boolean;
    hasDiscount: boolean;
};

export const PlanCardStyled = styled.div<Props>`
    display: flex;
    flex-direction: column;
    width: 397px;
    height: 359px;
    border-radius: 10px;
    background-color: ${(props) => (props.active ? '#FA6400' : '#DFE1E654')};
    margin-right: 2%;

    .top-container {
        display: flex;
        align-items: center;
        height: 20%;
        width: 100%;
    }

    .top-container > .price-text {
        font-family: 'Merriweather';
        display: flex;
        vertical-align: middle;
        font-weight: 900;
        font-size: 50px;
        padding-left: 5%;
        //line-height: 62.85px;
        text-decoration: ${(props) => (props.hasDiscount ? 'line-through' : 'none')};
        color: ${(props) => (props.active ? '#FFF' : '#FA6400')};
    }
    .top-container > .discounted-price-text {
        font-family: 'Merriweather';
        display: flex;
        vertical-align: middle;
        font-weight: 900;
        font-size: 12px;
        padding-left: 5px;
        color: ${(props) => (props.active ? '#FFF' : '#FA6400')};
    }

    .top-container > .plan-tenure {
        font-family: 'lato';
        font-weight: 400;
        padding-left: 5px;
        font-size: 16px;
        color: #000000;
    }

    .plan-name-heading {
        font-family: 'lato';
        height: 10%;
        padding: 5% 0% 0% 5%;
        font-weight: 700;
        font-size: 10px;
        letter-spacing: 0.5px;
        color: ${(props) => (props.active ? '#FFF' : '#FA6400')};
    }

    .plan-content {
        font-family: 'lato';
        display: flex;
        flex-direction: column;
        font-weight: 400;
        height: 40%;
        padding-top: 0.5%;
        padding-left: 5%;
        padding-right: 16%;
        font-size: 14px;
        line-height: 16.8px;
        color: #000000;
    }

    .apply-button {
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

    .thanks-span {
        font-family: 'Merriweather';
        background-color: #fa6400;
        width: 197px;
        height: 38px;
        margin: auto;
        text-align: center;
        font-weight: 900;
        font-size: 30px;
        border-radius: 4px;
        color: #fff;
    }
`;
