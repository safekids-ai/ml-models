import styled from 'styled-components';

export const Root = styled.div`
    display: flex;
    gap: 100px;
`;

export const LeftContentSection = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    .checkbox-label {
        margin-top: 8px;
        font-family: 'Lato', serif;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        color: #000;
    }
    .agreement-container {
        display: flex;
        flex-direction: column;
        max-width: 560px;
        margin-top: 20px;
        a {
            color: #fa6400;
            text-decoration: underline;
            cursor: pointer;
        }
        .MuiCheckbox-colorSecondary.Mui-checked .MuiIconButton-label {
            color: #fa6400 !important;
        }
        .signature-input {
            width: 400px;
            margin: 20px 0 25px 0;
            .MuiInputLabel-root.MuiInputLabel-shrink {
                color: #fa6400;
            }
            .MuiOutlinedInput-notchedOutline {
                border-radius: 7px;
            }
        }
        .checkbox-container {
            display: flex;
            margin-top: 10px;
        }
        .agreement-text {
            font-family: 'Lato', serif;
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            color: #000;
        }

        .MuiFormControlLabel-root {
            .MuiTypography-root {
                margin-top: 0px;
                line-height: 18px;
            }
            span {
                &.Mui-checked {
                    color: #fa6400;
                }
            }
        }
    }
`;

export const RightContentSection = styled.div`
    display: flex;
    flex-direction: column;
    span {
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
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 5px;
    max-width: 940px;
    line-height: 18px;
    color: #000000;
    a {
        color: #fa6400;
        text-decoration: underline;
        cursor: pointer;
    }
`;

export const ContinueButton = styled.div`
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 400px;
    margin-top: 40px;
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
