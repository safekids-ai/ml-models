import styled from 'styled-components';

export const Root = styled.div`
    .MuiAutocomplete-root {
        width: auto !important;
    }
    .MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root'] {
        border: 1px solid #000000;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        padding-right: 20px;
        background-color: white;
    }
`;

export const TableContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 10px;
    .header {
        display: flex;
        justify-content: space-between;
        .heading {
            font-size: 24px;
            font-weight: 700;
        }
        .export-button {
            background-color: #f7274a;
            color: white;
            height: 45px;
            width: 150px;
            align-self: end;
            margin-bottom: 10px;
            & span {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                font-size: 14px;
                line-height: 18px;
            }
        }
    }
`;

export const Content = styled.div`
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #f50c0c;
    border-radius: 10px;
    height: calc(100vh - 230px);
    margin-top: 20px;
`;

export const Title = styled.span<{ isMobile: boolean }>`
    display: flex;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 28px;
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
    margin-bottom: 30px;
    margin-left: ${(props: any) => (props.isMobile ? '80px' : 'initial')};
`;
