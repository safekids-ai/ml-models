import styled from 'styled-components';

export type Props = {
    colorRed?: boolean;
};
export const Title = styled.span`
    display: flex;
    align-items: center;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 15px;
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
`;

export const PlanContainer = styled.div`
    display: flex;
    padding-left: 20px;
    overflow-x: scroll;
`;
export const TrialStatusStyled = styled.div`
    display: flex;
    flex-direction: column;
    .trial-status {
        font-family: 'Lato';
        min-width: 500px;
        height: 18px;
        color: #000000;

        .view-plan {
            color: #fa6400;
            text-decoration-line: underline;

            &:hover {
                cursor: pointer;
                background-color: #ffffff;
            }
        }
    }
`;

export const HeadingContainerStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 90px;

    .cancel-service {
        margin-left: 10px;
        margin-top: 19px;
        box-shadow: none;
        & span {
            margin: 0;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            font-size: 15px;
            line-height: 18px;
            text-align: center;
            letter-spacing: 1.25px;
        }
        height: 60px !important;
        width: 190px;
        background-color: #ffffff;
        color: #000000;
        font-size: 15px;
        letter-spacing: 1.25px;
        border-radius: 6.9px;
        &:hover {
            background-color: #fafafa;
        }
    }

    .change {
        margin-left: 10px;
        margin-top: 19px;
        box-shadow: none;
        & span {
            margin: 0;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            font-size: 15px;
            line-height: 18px;
            text-align: center;
            letter-spacing: 1.25px;
        }
        height: 60px !important;
        width: 155px;
        background-color: #282828;
        color: white;
        font-size: 15px;
        letter-spacing: 1.25px;
        border-radius: 6.9px;
        &:hover {
            background-color: black;
        }
    }
`;

export const CardStatusStyled = styled.div<Props>`
    display: flex;
    flex-direction: column;
    width: 686px;
    height: 83px;
    .card-status {
        font-family: 'Lato';
        font-size: 14px;
        font-weight: 400;
        line-height: 16.8px;
        color: #000000;
    }

    .card-credentials {
        font-family: 'Lato';
        font-weight: 400;
        margin-top: 10px;
        font-size: 16px;
        color: ${(props) => (props.colorRed ? '#E02020' : '#000000')};
        line-height: 19.2px;
        letter-spacing: -0.25px;
    }
`;

export const PaymentStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: auto;

    .text {
        font-family: 'Lato';
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        color: #000000;
        text-align: justify;

        .support-link {
            color: #fa6400;
            text-decoration-line: underline;
        }
    }
`;
