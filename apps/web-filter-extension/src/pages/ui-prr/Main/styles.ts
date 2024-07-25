import styled from 'styled-components';

export const Container = styled.div`
    background-color: #fffdfd;
    display: flex;
    position: fixed;
    justify-content: center;
    z-index: 2147483647;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(255, 255, 255, 0.97);
    font-family: Merriweather, 'Google Sans';
`;
export const Oval = styled.div`
    min-width: 25%;
    max-width: 35%;
    margin-top: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    &:before {
        content: ' ';
        width: 92px;
        height: 92px;
        display: block;
        background-color: #f7274a;
        border-radius: 50%;
        position: absolute;
        left: 0;
    }
`;
export const OvalBefore = styled.div`
    content: ' ';
    width: 92px;
    height: 92px;
    display: block;
    background-color: #f7274a;
    border-radius: 50%;
    position: absolute;
    left: 0;
`;
export const Screen = styled.p`
    margin-left: 120px;
    margin-bottom: 6rem;
    margin-top: 1.5rem;
    font-size: 32px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
    line-height: 38px;
    display: none;
`;
export const Screen1 = styled.p`
    margin-left: 120px;
    margin-bottom: 6rem;
    margin-top: 1.5rem;
    font-size: 32px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
    line-height: 38px;
`;
export const BackButton = styled.button`
    height: 60px;
    background-color: #282828;
    font-family: Lato, sans-serif;
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 1.25px;
    text-align: center;
    color: #fff;
    padding: 1.2rem 3rem;
    border-radius: 6.93px;
    cursor: pointer;
    border: none;
`;

export const Link = styled.a`
    font-family: Lato;
    font-size: 14px;
    font-weight: bold;
    color: #f7274a;
    margin-top: 1rem;
    cursor: pointer;
`;
export const LinkLetUsKnow = styled.a`
    cursor: pointer;
    color: #f7274a;
    margin: 0 0 0 10px;
    text-decoration: underline;
`;

export const ContainerStyle = styled.div`
    display: flex;
    position: fixed;
    justify-content: center;
    z-index: 2147483647;
    background-color: rgba(255, 255, 255, 0.97);
    font-family: Merriweather, 'Google Sans';
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 25%;
    max-width: 35%;
    flex-direction: column;
    align-items: center;
    @media (min-height: 100px) and (max-height: 500px) {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    @media (min-width: 250px) and (max-width: 850px) {
        max-width: 55%;
    }
    @media (min-width: 250px) and (max-width: 1200px) and (max-height: 500px) {
        max-width: 55%;
    }
`;

export const FooterStyle = styled.div``;
export const ContentStyle = styled.div`
    margin-bottom: 3rem;
    margin-top: 1.5rem;
    font-size: 31px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
    line-height: 38px;
    font-family: Merriweather;
    @media (min-height: 460px) and (max-height: 688px) {
        font-size: 25px;
        margin-bottom: 2rem;
    }
    @media (min-height: 460px) and (max-height: 688px) and (max-width: 720px) {
        font-size: 22px;
        margin-bottom: 1rem;
    }
    @media (min-height: 200px) and (max-height: 460px) {
        font-size: 20px;
        margin-bottom: 1rem;
    }
    .screen-1-content {
        width: 424px;
        height: 40px;
        line-height: normal;
        text-align: center;
        @media (min-height: 200px) and (max-height: 460px) {
            font-size: 26px;
            margin-bottom: 2rem;
            width: 200px;
        }
    }
    .screen-2-content {
        margin: 31px 0 3px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
    }
    .screen-3-content {
        line-height: normal;
        width: 475px;
        height: 200px;
        margin: 50px 0 56px 46px;
        font-size: 32px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: -0.25px;
        line-height: normal;
        @media (min-height: 200px) and (max-height: 460px) {
            font-size: 22px;
            margin-bottom: 1rem;
            margin: 30px 0 10px 46px;
            width: 250px;
        }
        @media (min-height: 460px) and (max-height: 688px) and (max-width: 720px) {
            margin: 30px 0 10px 46px;
            width: 250px;
        }
    }

    span {
        width: 155px;
        height: 18px;
        margin: 0 2px 0 0;
        font-family: Lato;
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #282828;
    }
`;

export const HeaderStyle = styled.div`
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #979797;
    line-height: 0.1em;
    span {
        background: #fff;
        padding: 0 10px;
    }
    .screen-1-icon {
        width: 80px;
        height: 80px;
        transform: translate(-50px, 30px);

        @media (min-width: 380px) and (max-width: 688px) {
            transform: translate(-10px, 30px);
            width: 60px;
            height: 60px;
        }
    }
    .red-circle-icon {
        margin: 0 20px -20px;
    }
    .screen2-icon-prr {
        transform: translate(10px, 42px);
    }
    .screen3-icon-prr {
        transform: translate(10px, 42px);
    }
`;
