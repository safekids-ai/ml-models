import styled from 'styled-components';
import React from 'react';
import { InputField } from '../InputFields';
import { Form } from 'formik';

type Props = {
    isActive?: boolean;
};

export const CodeInput = styled(InputField)`
    width: 273px;
    margin: 8px 15px 8px 13px;
    background-color: #ffffff;
    height: 50px;
    min-height: unset;
    .MuiInputLabel-outlined {
        top: -3px;
    }

    .MuiInputLabel-root.MuiInputLabel-shrink {
        color: #fa6400;
    }
    .MuiOutlinedInput-root {
        height: 50px;
    }
    .MuiFormHelperText-root {
        margin-top: -3px;
    }

    .MuiOutlinedInput-notchedOutline {
        border-radius: 7px;
    }
`;

export const PromotionalCodeCardStyled = styled(Form)<Props>`
    display: flex;
    background-color: ${(props) => (props.isActive ? '#FA6400' : '#DFE1E654')};
    border-radius: 10px;
    width: 100%;
    height: 80px;
    margin-right: 2%;

    .left-section {
        width: ${(props) => (props.isActive ? '583px' : '356px')};
        margin-left: 2%;
        margin-top: 8px;
        font-family: 'Lato';
        display: flex;
        flex-direction: column;

        .title {
            width: 113px;
            color: ${(props) => (props.isActive ? '#FFFFFF' : '#FA6400')};
            font-weight: 700;
            font-size: 10px;
            line-height: 12px;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .text-code {
            width: 356px;
            height: 44px;
            font-size: 14px;
            color: #000000;
        }

        .thirty-days-text {
            color: #ffffff;
        }
    }

    .code-input {
        display: flex;
        justify-content: center;
        align-items: center;

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

        .disabled-button {
            background-color: rgb(193, 199, 208);
        }
    }

    .thanks-span {
        font-family: 'Merriweather';
        text-align: center;
        margin-top: 14px;
        width: 197px;
        height: 38px;
        font-weight: 900;
        font-size: 30px;
        border-radius: 4px;
        color: #fff;
    }
`;
