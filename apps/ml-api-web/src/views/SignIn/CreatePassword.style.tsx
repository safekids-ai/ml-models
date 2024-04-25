import styled from 'styled-components';
import { PasswordField, SubmitButton } from '../../components/InputFields';

export const PasswordInputContainer = styled(PasswordField)`
    .MuiInputLabel-root.MuiInputLabel-shrink {
        color: #fa6400;
    }
    svg {
        color: #fa6400;
    }
`;

export const SubmitBtnContainer = styled(SubmitButton)`
    background-color: #fa6400;
    &:hover {
        background-color: rgb(230 26 26);
    }
`;
