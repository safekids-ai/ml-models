import styled from 'styled-components';

export const Root = styled.div`
    min-height: inherit;
    height: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    background: white;
    padding: 40px 90px 40px 120px;
    justify-content: space-between;
    .container {
        display: flex;
        flex-direction: column;
    }
`;

export const ContentContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: start;
`;

export const Content = styled.div`
    margin-left: 12%;
    align-self: stretch;
`;

export const Description = styled.span`
    height: 100px;
    margin-top: 20px;
    line-height: 18px;
    max-width: 630px;
    color: #000;
`;
