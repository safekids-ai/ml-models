import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    .left-section {
        .img-container {
            height: 24px;
            width: 150px;
            img {
                margin-left: -5px;
                object-fit: fill;
                width: 100%;
                height: 100%;
            }
        }
        .title {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            color: #000000;
            padding-left: 60px;
        }
    }
`;

export const Title = styled.div`
    cursor: default;
    font-family: 'Roboto', sans-serif;
    font-size: 22px;
    font-weight: 700;
    text-align: center;

    #logo-first-letters {
        color: #7c82dc;
    }
`;

export const ThemeToggle = styled.div`
    margin: 15px 15px;
    position: absolute;
    right: 0;
    top: 0;
    transform: scale(0.8);
`;
