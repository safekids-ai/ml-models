import { TextField } from '@material-ui/core';
import styled from 'styled-components';

export const CancellationFormStyled = styled.div`
    .root {
        display: flex;
        flex-direction: column;
        width: 461px;
        height: 575px;
        border-radius: 10px;
        margin-left: 18px;
        margin-top: 19px;
        margin-right: 18px;
        background-color: #ffffff;

        .cancellation-header {
            display: flex;

            .title {
                font-family: 'Merriweather';
                color: #4a4a4a;
                font-size: 28px;
                font-weight: 900;
                line-height: 35.2px;
                letter-spacing: -0.25px;
                width: 418px;
                height: 35px;
                margin-bottom: 7px;
            }

            .close-form {
                background-color: #c1c7d0;
                color: #ffffff;
                border-radius: 100%;
                width: 35px;
                height: 35px;
                padding: 5px 5px 5px 5px;
                margin-bottom: 7px;

                &:hover {
                    cursor: pointer;
                }
            }
        }

        .choose-text {
            font-family: 'Lato';
            color: #fa6400;
            font-weight: 700;
            font-size: 10px;
            line-height: 12px;
            letter-spacing: 0.5px;
            margin-top: 6px;
            margin-bottom: 6px;
        }

        .tell-text {
            font-family: 'Lato';
            color: #fa6400;
            font-weight: 700;
            font-size: 10px;
            line-height: 12px;
            letter-spacing: 0.5px;
            margin-top: 7px;
            margin-bottom: 4px;
        }

        .input-container {
            width: auto;
            height: 89px;
            margin-top: 4px;
        }

        .apply-button {
            background-color: #282828;
            width: 93px;
            border-radius: 4px;
            margin-top: 0;
            height: 45px;
            box-shadow: none !important;
            &:hover {
                background-color: #000000;
            }
        }

        .confirm-cancellation {
            font-family: 'Lato';
            font-weight: 500;
            font-size: 18px;
            line-height: 24px;
            background-color: #282828;
            box-shadow: none !important;
            color: #ffffff;
            width: 262px;
            height: 48px;
            border-radius: 4px;
            margin: auto;

            &:hover {
                cursor: pointer;
                background-color: #000000;
            }
        }
    }
`;

export const FeedbackInputStyled = styled(TextField)`
    .MuiOutlinedInput-input {
        height: unset;
    }
    .MuiOutlinedInput-root {
        height: unset;
    }
`;
