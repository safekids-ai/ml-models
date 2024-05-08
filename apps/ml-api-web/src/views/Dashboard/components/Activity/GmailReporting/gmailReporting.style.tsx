import styled from 'styled-components';

export const Container = styled.div`
    height: 72px;
    width: 100%;
    padding: 25px 0px 25px 30px;
    padding-right: 80px;
    border-radius: 10px;
    background-color: white;
    border: 2px solid rgb(0, 0, 0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:first-child {
        padding-top: 4px;
    }
    div {
        display: flex;
        align-items: center;
        .left {
            width: auto;
            margin-right: 15px;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            font-size: 40px;
            line-height: 48px;
            color: #000000;
        }
        .right {
            width: 150px;
            height: auto;
            display: inline-block;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 13px;
            color: #000000;
            .number {
                color: #d52b4a;
            }
        }
        .email-analysis {
            font-family: 'Merriweather';
            font-style: normal;
            font-weight: 900;
            font-size: 15px;
            line-height: 18px;
            letter-spacing: -0.25px;
            color: #4a4a4a;
        }
    }
    @media screen and (max-width: 1320px) {
        height: auto;
        flex-wrap: wrap;
    }
`;

export const NoDataAvailable = styled.div`
    background: #97979796;
    height: 72px;
    width: 100%;
    padding: 25px 0px 25px 30px;
    padding-right: 80px;
    border-radius: 10px;
    font-size: 24px;
    color: red;
    display: flex;
    justify-content: center;
    align-items: center;
`;
