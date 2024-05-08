import styled from 'styled-components';

export const Root = styled.div`
    min-height: 530px;
`;

export const LoadingContainer = styled.div`
    height: 500px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
        border-color: rgb(255, 255, 255) rgb(247 39 74) rgba(255, 255, 255, 0.4);
        border-width: 4px;
        width: 45px;
        height: 45px;
    }
`;
