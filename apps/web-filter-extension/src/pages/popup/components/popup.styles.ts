import styled from 'styled-components';
import { Spin } from 'antd';
type ContainerProps = {
    isOnBoarding?: boolean;
};
export const Container = styled.div<ContainerProps>`
    background-color: ${(props) => props.theme.bg.primary};
    color: ${(props) => props.theme.text.primary};
    border: 1px solid #d2d2d2;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 400;
    height: ${(props) => (props?.isOnBoarding ? '435px' : '100%')};
    width: 320px;
    padding: 20px 20px 15px 20px;
`;

export const CustomButton = styled.button`
    background: #282828;
    padding: 20px 34px;
    box-shadow: 0px 12px 40px -10px rgba(193, 199, 208, 0.5);
    border-radius: 6.93px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 1.25px;
    text-transform: uppercase;
    color: #ffffff;
    cursor: pointer;
`;

export const BottomContainer = styled.div`
    display: flex;
    justify-content: center;
    height: 20px;
    width: 100%;
    p {
        margin: 0;
        padding: 0;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 18px;
        /* identical to box height, or 129% */
        text-align: center;
        color: #4a4a4a;
    }
`;

export const PopupSpinnerContainer = styled.div`
    height: 315px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const CustomSpinner = styled(Spin)``;
