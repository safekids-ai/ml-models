import styled from 'styled-components';

export const Root = styled.div`
    display: flex;
    height: inherit;
`;

export const LeftTable = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
`;

export const RightTable = styled.div<{ isSettings: boolean | undefined }>`
    display: flex;
    flex-direction: column;
    width: 300px;
    position: relative;
    .MuiTabs-root {
        height: 40px;
        min-height: 40px;
        border: 1px solid #565555;
        overflow: visible;
        .MuiTabs-fixed {
            overflow: visible !important;
        }
    }
    .MuiTab-textColorInherit.Mui-selected {
        opacity: 1;
    }
    .MuiTab-textColorInherit {
        opacity: 0.4;
    }
    .MuiTab-root {
        pointer-events: ${(props: any) => (!props.isSettings ? 'none' : 'initial')};
        min-height: 40px;
        min-width: 149.5px;
        .MuiTab-wrapper {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            font-size: 18px;
            line-height: 18px;
            color: #000;
            text-transform: none;
        }
    }
    .MuiTabPanel-root {
        padding: 0;
    }
`;

export const Heading = styled.span`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 18px;
    border: 1px solid #565555;
    padding: 10px 10px 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
`;

export const Content = styled.div`
    align-self: stretch;
    border: 1px solid #565555;
    height: 400px;
    padding: 5px 0 0 0;
    overflow-y: auto;
    & > div > div {
        height: auto !important;
    }
`;

export const UrlContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px 5px 20px;
    & span a {
        max-width: 200px;
        line-break: anywhere;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 16px;
        color: #4a4a4a;
    }
`;

export const RemoveIcon = styled.div<{ disable: boolean }>`
    border-radius: 50%;
    background-color: ${(props: any) => (props.disable ? 'grey' : '#000')};
    width: 13px;
    height: 13px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    line-height: 9px;
    cursor: ${(props: any) => (props.disable ? 'default' : 'pointer')};
    pointer-events: ${(props: any) => (props.disable ? 'none' : 'default')};
`;

export const AddedUrl = styled.span<{ invalid: boolean }>`
    a {
        color: ${(props: any) => (props.invalid ? '#F7274A !important' : '#36B37E !important')};
    }
`;

export const CheckboxContainer = styled.div`
    display: flex;
    & .MuiCheckbox-root {
        padding: 0;
    }
    & span {
        margin-left: 5px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
    }
    & svg {
        cursor: pointer;
        margin-left: 5px;
    }
`;

export const ApplyToAll = styled.div`
    display: flex;
    align-items: center;
    & button {
        height: 28px;
    }
    & svg {
        cursor: pointer;
        width: 24px;
        margin-left: 8px;
    }
`;

export const Undo = styled.span<{ disable: boolean }>`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    text-align: center;
    text-decoration-line: underline;
    position: absolute;
    right: 15px;
    top: 13px;
    z-index: 1;
    color: ${(props: any) => (props.disable ? 'grey' : '#f7274a')};
    cursor: ${(props: any) => (props.disable ? 'default' : 'pointer')};
    pointer-events: ${(props: any) => (props.disable ? 'none' : 'default')};
`;

export const HelpContainer = styled.div`
    display: flex;
`;
