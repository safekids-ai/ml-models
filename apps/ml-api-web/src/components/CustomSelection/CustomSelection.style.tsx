import styled from 'styled-components';

export const CustomSelectionStyled = styled.div`
    .values-container {
        display: flex;
        flex-direction: column;
        font-family: 'Lato';
        width: auto;
        font-weight: 400;
        font-size: 14px;
        line-height: 16.8px;

        .selected-values {
            color: #ffffff;
            background-color: #fa6400;
            margin-bottom: 4px;
            margin-top: 4px;
            height: 63px;
            border-radius: 10px;
            padding-top: 20px;
            padding-left: 20px;
        }

        .values {
            color: #000000;
            background-color: rgba(223, 225, 230, 0.33);
            margin-bottom: 4px;
            margin-top: 4px;
            height: 63px;
            border-radius: 10px;
            padding-top: 20px;
            padding-left: 20px;
        }

        &:hover {
            cursor: pointer;
        }
    }
`;
