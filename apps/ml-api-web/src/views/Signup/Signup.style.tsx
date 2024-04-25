import styled from 'styled-components';
import { InputField, PasswordField, SubmitButton } from '../../components/InputFields';

export const LinkSpan = styled.span`
    color: #fa6400;
`;

export const LinkRef = styled.a`
    color: #fa6400;
`;

export const InputContainer = styled(InputField)`
    .MuiInputLabel-root.MuiInputLabel-shrink {
        color: #fa6400;
    }
`;

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
