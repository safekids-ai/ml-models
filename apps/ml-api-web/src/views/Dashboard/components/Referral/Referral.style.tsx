import styled from 'styled-components';

export const Title = styled.span`
    display: flex;
    align-items: center;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 15px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
`;

export const ReferralStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: auto;

    .container {
        display: flex;
        flex-direction: row;
        width: auto;
        justify-content: space-between;

        .content {
            display: flex;
            flex-direction: column;
            margin-right: 30px;
            margin-top: 6px;
            font-family: 'Lato';
            font-weight: 400;
            font-size: 14px;
            color: #000000;
            text-align: justify;

            .redemptions-count {
                font-family: Lato;
                font-size: 30px;
                font-weight: 700;
                letter-spacing: 1.25px;
                text-align: center;
                color: #fa6400;
            }
        }

        .promo-code {
            font-family: Lato;
            font-size: 14px;
            font-weight: 400;
            line-height: 18px;
            padding-left: 22px;
            background: #ffffff;
            border: 1px solid #979797;
            color: #030047;
            border-radius: 6.93px;
            height: 60px;
            width: 312px;
            margin-right: 30px;
        }

        .copy-button {
            font-family: Lato;
            font-size: 15px;
            font-weight: 700;
            line-height: 18px;
            letter-spacing: 1.25px;
            text-align: center;
            width: 155px;
            height: 60px;
            background: #282828;
            box-shadow: 0px 12px 40px -10px rgba(193, 199, 208, 0.5);
            border-radius: 6.93px;
            color: #ffffff;
            text-transform: uppercase;
            &:hover {
                background-color: #000000;
            }
        }
    }

    .description {
        margin-top: 6px;
        font-family: 'Lato';
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        text-align: justify;
    }
`;
