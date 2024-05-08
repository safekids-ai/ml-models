import styled from 'styled-components';

export const Root = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    button {
        width: 155px;
        height: 60px;
        padding: 0;
        margin: 0;
        background-color: #282828;
        box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
        &:hover {
            background-color: black;
        }
    }
`;

export const SelectSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    .select-label {
        padding-left: 5px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        color: #000000;
    }
`;
