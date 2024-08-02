import styled, { css } from 'styled-components';

interface ContentProps {
    $isOnBoarding: boolean;
}

const settingsRemoveSpanStyles = css`
    position: absolute;
    right: 0;
    bottom: 40px;
    margin: 0;
`;

const settingsSpacer = css`
    border-bottom: 2px solid #fa6400;
    margin-bottom: 20px;
`;

export const Root = styled.div<ContentProps>`
    display: flex;
    flex-direction: column;
    position: relative;
    .content {
        position: relative;
        max-width: ${(props) => (props.$isOnBoarding ? '400px' : '100%')};
        padding-right: ${(props) => (props.$isOnBoarding ? '0' : '50px')};
        width: 100%;
        .remove-span {
            margin-bottom: 20px;
            text-transform: uppercase;
            color: #fa6400;
            cursor: pointer;
            text-decoration: underline;
            ${settingsRemoveSpanStyles}
        }
        .form-container {
            padding-right: 20px;
            overflow: auto;
            min-height: 300px;
            max-height: calc(100vh - 550px);
            height: fit-content;
            .kid-component-wrapper {
                position: relative;
                ${settingsSpacer}
            }
            .kid-component-wrapper:last-child {
                border-bottom: 0;
            }
        }
        .MuiInputLabel-root.MuiInputLabel-shrink {
            color: #fa6400;
        }
        .MuiTextField-root {
            margin: 5px 0;
        }
        .MuiOutlinedInput-notchedOutline {
            border-radius: 7px;
        }
        .email-input {
            margin-bottom: 35px;
        }
        .date-range {
            width: 50%;
            margin-bottom: 20px;
        }
        .disable-setting {
            position: absolute;
            right: 58px;
            bottom: 0px;
            width: 120px;
            > .Mui-disabled {
                color: rgb(255, 255, 255);
                box-shadow: rgb(193 199 208 / 50%) 0px 12px 40px -10px;
                background-color: rgb(193, 199, 208);
            }
        }
        .setting-btn {
            position: absolute;
            right: 58px;
            bottom: 0px;
            width: 120px;
            > button {
                box-shadow: rgb(247 39 74 / 50%) 0px 12px 40px -10px;
                background-color: #f7274a;
            }
            > button:hover {
                background-color: rgb(172, 27, 51);
            }
        }
        .add-more-container {
            display: flex;
            align-items: center;
            margin-top: ${(props) => (props.$isOnBoarding ? '10px' : '20px')};
            span {
                width: 260px;
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 18px;
                color: #000000;
            }
            & button {
                margin-right: 15px;
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
                height: 60px !important;
                width: 155px;
                background-color: #282828;
                color: white;
                font-size: 15px;
                height: 52px;
                letter-spacing: 1.25;
                border-radius: 6.9px;
                &:hover {
                    background-color: black;
                }
            }
        }
    }
`;

export const Title = styled.span<ContentProps>`
    display: flex;
    align-items: center;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: ${(props) => (props.$isOnBoarding ? '28px' : '15px')};
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
    margin-bottom: 15px;
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
    margin-top: 50px;
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
