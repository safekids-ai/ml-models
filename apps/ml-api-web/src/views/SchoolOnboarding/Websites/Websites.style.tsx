import styled from 'styled-components';

export const Root = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
`;

export const Title = styled.span<{ isSettings: boolean | undefined }>`
    display: flex;
    align-items: center;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: ${(props: any) => (props.isSettings ? '15px' : '28px')};
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
`;

export const Description = styled.span`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
`;

export const ContinueButton = styled.div`
    width: 400px;
    & button {
        margin-top: 0;
    }
    & .MuiButton-label {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        /* identical to box height, or 120% */
        text-align: center;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }
`;

export const AddWebsitesContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 20px 0 50px 5px;
    & span {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        width: 190px;
        text-align: right;
        margin-right: 10px;
    }
    & input {
        background: #ffffff;
        border: 1px solid #979797;
        border-radius: 6.93px;
        width: 303px;
        height: 60px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        padding-left: 22px;
        &:focus-visible {
            outline: none;
        }
    }
    & button {
        margin-left: 10px;
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
        width: 155px;
        background-color: #282828;
        color: white;
        font-size: 15px;
        height: 52px;
        letterspacing: 1.25;
        border-radius: 6.9px;
        &:hover {
            background-color: black;
        }
    }
`;

export const SaveButton = styled.div`
    width: 120px;
    position: absolute;
    bottom: 50px;
    left: 700px;
    & button {
        margin-top: 0;
    }
    & .MuiButton-label {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        text-align: center;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }
`;
