import styled from 'styled-components';

export const Root = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
`;

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

export const CheckboxContainer = styled.div`
    & .MuiFormControlLabel-root {
        cursor: initial;
    }
    & .MuiTypography-body1 {
        font-size: 14px;
        pointer-events: none;
        cursoe: initial;
        color: #000;
    }
`;
