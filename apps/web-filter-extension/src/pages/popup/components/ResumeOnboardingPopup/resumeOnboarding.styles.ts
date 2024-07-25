import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 315px;
`;

export const Stats = styled.div`
    cursor: default;
    padding-bottom: 15px;
    text-align: center;
`;

export const Row = styled.div`
    align-content: center;
    display: flex;
    flex-direction: row;
    padding: 7px 0;
`;

export const DropdownRow = styled(Row)`
    align-items: center;
    justify-content: space-between;
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
