import styled from 'styled-components';
import { Spin } from 'antd';

type ErrorMessageInterface = {
    error?: string;
};

export const Root = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 280px;
    height: 100%;
    margin-top: 36px;
    margin-left: 75px;
    margin-right: 100px;
    .form-container {
        display: flex;
        flex-direction: column;
        position: relative;
        .form-heading {
            max-width: 450px;
            display: flex;
            flex-direction: column;
            font-family: 'Merriweather';
            font-style: normal;
            font-weight: 900;
            font-size: 28px;
            line-height: 35px;
            letter-spacing: -0.25px;
            color: #4a4a4a;
            span,
            p {
                margin-bottom: 15px;
            }
            .description {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                font-size: 20px;
                line-height: 24px;
                letter-spacing: -0.25px;
                color: #000000;
            }
            p {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                font-size: 20px;
                line-height: 24px;
                letter-spacing: -0.25px;
                color: #4a4a4a;
                > a {
                    /* text-decoration-line: underline; */
                    color: #fa6400;
                    margin-left: 3px;
                    border-bottom: 1px solid #fa6400;
                    text-decoration: none !important;
                }
            }
        }
        .form-field {
            display: flex;
            flex-direction: column;
            margin-bottom: 30px;
            span {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                font-size: 10px;
                line-height: 12px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                color: #fa6400;
                margin-bottom: 7.5px;
            }
            input {
                border: 1px solid #dfe1e6;
                border-radius: 7px;
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 18px;
                color: #4a4a4a;
                height: 60px;
                padding: 15px 25px;
                outline: none;
                &::placeholder {
                    color: #999999;
                }
            }
            .access-code-container {
                display: flex;
                input {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 20px !important;
                    color: #4a4a4a;
                    border: 1px solid #dfe1e6;
                    border-radius: 7px;
                    margin: 0 2px;
                    font-size: 2rem;
                    height: 4rem;
                    outline: none;
                    text-align: center;
                    width: 4rem;
                    &:nth-of-type(3) {
                        margin-right: 30px;
                    }
                }
            }
            .pin-input-field {
                text-transform: uppercase;
                padding: 0px;
            }
        }
    }
    .button-container {
        display: flex;
        flex-direction: column;
        width: fit-content;
        button {
            position: relative;
            background-color: #fa6400;
            border: none;
            border-radius: 5px;
            height: 60px;
            width: 245px;
            cursor: pointer;
            &:focus {
                outline: none;
            }
            &:disabled {
                background-color: #c1c7d0;
                pointer-events: none;
            }
            .text {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                font-size: 15px;
                text-align: center;
                letter-spacing: 1.25px;
                color: #ffffff;
                text-transform: uppercase;
            }
            div {
                position: absolute;
                right: 70px;
                top: 20px;
            }
        }
    }
    .companion-button-container {
        display: flex;
        flex-direction: column;
        width: fit-content;
        margin-bottom: 15px;
        button {
            position: relative;
            background-color: #000000;
            border: none;
            border-radius: 5px;
            height: 60px;
            width: 245px;
            cursor: pointer;
            &:focus {
                outline: none;
            }
            &:disabled {
                background-color: #00aa00;
                pointer-events: none;
            }
            .text {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                font-size: 15px;
                text-align: center;
                letter-spacing: 1.25px;
                color: #ffffff;
                text-transform: uppercase;
            }
            div {
                position: absolute;
                right: 70px;
                top: 20px;
            }
        }
    }
`;

export const ErrorMessageContainer = styled.div<ErrorMessageInterface>`
    position: absolute;
    bottom: -60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 4px;
    padding: 11px 16px;
    background-color: rgb(253, 236, 234);
    width: fit-content;
    align-self: center;
    margin: 5px 0;
    ${(props) => (!props.error || props.error === '') && `visibility: hidden;`}
    .error-msg {
        width: fit-content;
        margin: 0;
        color: rgb(97, 26, 21);
        font-size: 0.875rem;
        font-family: Lato, Roboto, Helvetica, Arial, sans-serif;
        font-weight: 400;
        line-height: 1.43;
    }
`;

export const CustomSpinner = styled(Spin)`
    color: #fff;
`;
