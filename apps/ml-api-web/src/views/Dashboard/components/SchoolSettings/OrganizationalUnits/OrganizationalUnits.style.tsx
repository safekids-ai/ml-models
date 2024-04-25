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

export const Description = styled.span`
    margin-top: 10px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #000;
`;

export const OUContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #565555;
    margin-top: 15px;
    padding: 15px 25px;
    height: 340px;
    overflow-y: auto;
    & span {
        margin-bottom: 15px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 18px;
    }
`;

export const SyncButton = styled.div`
    button,
    button.Mui-disabled {
        margin-top: 0;
        position: absolute;
        width: 130px;
        top: 0;
        right: 0;
        & span {
            margin: 0;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            font-size: 15px;
            line-height: 18px;
            text-align: center;
            letter-spacing: 1.25px;
        }
        height: 60px !important;
        background-color: #282828;
        color: white;
        font-size: 15px;
        height: 52px;
        letterspacing: 1.25;
        border-radius: 6.9px;
        &:hover {
            background-color: black;
        }
        box-shadow: none;
    }
`;

export const LoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: inherit;
    justify-content: center;
    align-items: center;
    margin-bottom: 35px;
    span {
        margin-bottom: 35px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
    }
`;
