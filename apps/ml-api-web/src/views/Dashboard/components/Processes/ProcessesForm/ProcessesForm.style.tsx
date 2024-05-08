import styled from 'styled-components';

export const Root = styled.div``;

export const HeaderSection = styled.section`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    button {
        width: 155px;
        height: 60px;
        padding: 0;
        margin: 0;
        background-color: #282828;
        box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
        &:hover {
            background-color: black;
        }
    }
`;

export const BodySection = styled.section`
    .body-heading {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 18px;
        margin-bottom: 6px;
        margin-left: 20px;
    }
    .process-container {
        width: 675px;
        max-height: 378px;
        min-height: 378px;
        margin-left: 15px;
        border: 1px solid #565555;
        padding: 10px 10px 10px 25px;
        overflow-y: scroll;
        list-style-type: none;

        ::-webkit-scrollbar {
            width: 12px;
            padding-right: 10px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: #fff;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: #c4c4c4;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        .process-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;

            .process-name {
                display: flex;
                align-items: center;
                a {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 19px;
                    letter-spacing: -0.1875px;
                    color: #000000;
                }
            }

            .remove-icon {
                padding: 0;
                margin: 0;
                margin-right: 10px;
                border-radius: 50%;
                background-color: #000000;
                width: 15px;
                height: 15px;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                line-height: 9px;
                cursor: pointer;
                pointer-events: default;
            }
        }
    }
`;

export const AddedProcess = styled.span<{ invalid: boolean }>`
    a {
        color: ${(props: any) => (props.invalid ? '#F7274A !important' : '#36B37E !important')};
    }
`;

export const FooterSection = styled.section`
    margin-top: 0;
    .message-for-parent {
        margin: -15px 0 0 14px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: -0.1875px;
        color: #4a4a4a;
        .bold {
            font-weight: 700;
        }
    }
`;

export const SelectSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    .select-label {
        padding-left: 5px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        color: #000000;
    }
`;

export const FieldWrapper = styled.div`
    min-height: 48px;
    height: 48px;
    width: 146px;
    background: #fff;
    border: 2px solid #7a7a7a;
    border-radius: 7.93px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 12px;
    .date-field,
    .select-field {
        display: flex;
        justify-content: center;
        .MuiInputBase-input {
            font-family: 'Lato';
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            color: #fa6400;
        }
    }
    .MuiInputLabel-root {
        display: 'none';
    }
    &:hover {
        border: '2px solid #000';
    }
`;

export const AddProcessContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: -10px 0 10px 5px;
    & span {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        width: 190px;
        text-align: left;
        margin: 0 10px;
    }
    & input {
        background: #ffffff;
        border: 1px solid #979797;
        border-radius: 6.93px;
        width: 476px;
        height: 60px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        padding-left: 22px;
        margin-right: 10px;
        &:focus-visible {
            outline: none;
        }
    }
    & button {
        margin-left: 10px;
        margin-top: 19px;
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
        letter-spacing: 1.25;
        border-radius: 6.9px;
        &:hover {
            background-color: black;
        }
    }
`;

export const CustomLoaderDelete = styled.div<{ loading: boolean }>`
    padding: 0;
    margin: 0;
    margin-right: 10px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    color: white;
    color: ${(props: any) => (props.loading ? '#000 !important' : '#fff !important')};
    background-color: ${(props: any) => (props.loading ? '#c1c7d0 !important' : '#000 !important')};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    line-height: 9px;
    font-weight: ${(props: any) => (props.loading ? '800' : '400')};
    cursor: pointer;
    pointer-events: default;
`;

export const CustomChip = styled.div<{ isInvalid: boolean | undefined }>`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    width: 55px;
    /* padding: 2px 12px; */
    border-radius: 20px;
    font-family: 'Lato';
    font-style: normal;
    font-size: 10px;
    outline: 0;
    border: 0;
    color: #fff;
    background: ${(props: any) => (props.isInvalid ? '#F7274A !important' : '#36B37E !important')};
`;
