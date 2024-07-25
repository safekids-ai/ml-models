import styled from 'styled-components';

export const Root = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .text-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        img {
            height: 50px;
            margin-top: 5px;
            margin-bottom: 5px;
            /* margin-bottom: 25px; */
        }
        .welcome-text {
            font-family: 'Merriweather';
            font-style: normal;
            font-weight: 900;
            font-size: 36px;
            line-height: 45px;
            letter-spacing: -0.25px;
            color: #4a4a4a;
        }
        span {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            color: #4a4a4a;
            a {
                color: #fa6400 !important;
                cursor: pointer;
            }
        }
        .at-home-text {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            line-height: 24px;
            display: flex;
            align-items: center;
            text-align: right;
            color: #000000;
            margin-left: 80px;
            margin-bottom: 5px;
        }
        p {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            text-align: right;
            color: #4a4a4a;
            > a {
                text-decoration-line: underline;
                color: #fa6400;
                margin-left: 3px;
            }
        }
    }
    button {
        background-color: #fa6400;
        border: none;
        border-radius: 5px;
        height: 60px;
        width: 410px;
        cursor: pointer;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        text-align: center;
        letter-spacing: 1.25px;
        color: #ffffff;
        &:focus {
            outline: none;
        }
        /* span { */
        /* font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            font-size: 15px;
            line-height: 18px;
            text-align: center;
            letter-spacing: 1.25px;
            color: #ffffff; */
        /* } */
    }
`;

export const ImageContainer = styled.div`
    width: auto;
    margin-bottom: 70px;
    img {
        height: 350px;
        margin-top: 20px;
        margin-bottom: 40px;
    }
    ul {
        display: flex;
        justify-content: space-around;
        gap: 33px;
        li {
            width: 265px;
            list-style-type: none;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            font-size: 20px;
            line-height: 24px;
            letter-spacing: -0.25px;
            color: #000000;
        }
        li:first-child {
            margin-left: 40px;
        }
    }
`;
