import styled from 'styled-components';

export const Root = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 40px 40px 0px 40px;
    .header {
        width: 100%;
        height: 40px;
        padding-left: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        img {
            height: 35px;
        }
        p {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 500;
            font-size: 18px;
            line-height: 24px;
            display: flex;
            align-items: center;
            text-align: right;
            color: #000000;
            margin-left: 90px;
            margin-bottom: 5px;
        }
    }
    .content {
        height: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
