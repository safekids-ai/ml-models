import styled from 'styled-components';

export const Root = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    .content {
        display: flex;
        flex-direction: column;
        .download-info {
            margin-top: 15px;
            width: 625px;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            font-size: 20px;
            line-height: 24px;
            letter-spacing: -0.25px;
            color: #000000;
            a {
                color: #fa6400 !important;
                text-decoration: underline;
                cursor: pointer;
            }
        }
        .kid-info-list {
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            height: auto;
            .kid-info-container {
                .kid-info {
                    display: flex;
                    align-items: center;
                    margin-bottom: 25px;
                    .MuiAvatar-colorDefault {
                        height: 56px;
                        width: 56px;
                        background-color: #d9d9d9;
                        font-family: 'Lato';
                        font-style: normal;
                        font-weight: 700;
                        font-size: 24px;
                        line-height: 18px;
                        text-align: center;
                        color: #fff;
                    }
                    .kid-name {
                        margin-left: 20px;
                        font-family: 'Lato';
                        font-style: normal;
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 18px;
                        color: #000000;
                    }
                }
                .access-code-container {
                     {
                        display: flex;
                        flex-direction: column;
                        margin: 25px 0;
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
                        .access-code-field {
                            display: flex;
                            input {
                                background-color: #fff;
                                font-family: 'Merriweather';
                                font-style: normal;
                                font-weight: 900;
                                font-size: 28px;
                                line-height: 35px;
                                letter-spacing: -0.21875px;
                                color: #4a4a4a;
                                border: 1px solid #dfe1e6;
                                border-radius: 7px;
                                margin: 0 2px;
                                outline: none;
                                padding: 5px;
                                text-align: center;
                                width: 4rem;
                                &:nth-of-type(3) {
                                    margin-right: 30px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const StepsList = styled.ul`
    margin: 0;
    padding: 0;
    li {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 25px;
        .step-number {
            font-family: 'Merriweather';
            font-style: normal;
            font-weight: 900;
            font-size: 50px;
            line-height: 63px;
            letter-spacing: -0.25px;
            color: #4a4a4a;
        }
        .step-description {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 19px;
            letter-spacing: -0.25px;
            color: #000000;

            a {
                color: #fa6400;
            }
        }
    }
    li:first-child {
        margin-top: 10px;
    }
    li:last-child {
        margin-bottom: 0;
    }
`;

export const Title = styled.span`
    display: flex;
    align-items: center;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 28px;
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
`;

export const Description = styled.span`
    margin-top: 20px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #000000;
`;

const FinishButton = styled.div`
    margin-top: 50px !important;
    margin-left: 100px;
    width: 200px;
    & button {
        margin-top: 0;
    }
    & .MuiButton-label {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        text-align: center;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }
`;

export const ContinueButton = styled.div`
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 400px;
    margin-top: 30px;
    & button {
        &:hover {
            background-color: rgb(230 26 26);
        }
        margin-top: 0;
        background-color: #fa6400;
    }
    & .MuiButton-label {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        text-align: center;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }
`;
