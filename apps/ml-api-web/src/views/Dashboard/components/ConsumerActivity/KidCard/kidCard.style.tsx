import styled from 'styled-components';

export const KidCardStyled = styled.div`
    width: 100%;
    margin: 0 0 10px 0;
    border-radius: 10px;
    background-color: white;
    padding: 25px 17px;

    .kid-info-container {
        .kid-info {
            display: flex;
            align-items: center;

            .MuiAvatar-colorDefault {
                height: 56px;
                width: 56px;
                background-color: #fa6400;
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                font-size: 24px;
                line-height: 18px;
                text-align: center;
                color: #ffffff;
            }

            .kid-info-inner-container {
                display: flex;
                flex-direction: column;
            }
            .connected {
                color: #0bad37;
            }
            .not-connected {
                color: #e02020;
            }
            .kid-name {
                min-width: 150px;
                text-align: left;
                margin-left: 24px;
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 18px;
                color: #000000;
            }
            .kid-status {
                width: 100%;
                text-align: left;
                margin-left: 24px;
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 18px;
            }

            .show-access-link {
                width: 100%;
                text-align: right;
                color: #fa6400;
                text-decoration-line: underline;
                font-weight: 400;
                font-size: 14px;
                line-height: 16.8px;
                cursor: pointer;
            }
        }
        .access-code-container {
            display: flex;
            flex-direction: column;
            margin: 10px 0;
            span {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                font-size: 10px;
                line-height: 12px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                color: #fa6400;
                margin-bottom: 7.5px;
            }
            input {
                border: 1px solid #dfe1e6;
                border-radius: 7px;
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 18px;
                color: #4a4a4a;
                height: 60px;
                padding: 15px 25px;
                outline: none;
                &::placeholder {
                    color: #999999;
                }
            }
            .access-code-field {
                display: flex;
                grid-gap: 4px;
                input {
                    background-color: #fff;
                    font-family: 'Merriweather';
                    font-style: normal;
                    font-weight: 900;
                    font-size: 28px;
                    line-height: 35px;
                    letter-spacing: -0.21875px;
                    color: #4a4a4a;
                    border: 1px solid #dfe1e6;
                    border-radius: 7px;
                    outline: none;
                    padding: 5px;
                    text-align: center;
                    width: 4rem;
                    &:nth-of-type(3) {
                        margin-right: 25px;
                    }
                    @media screen and (max-width: 479px) {
                        width: 2.8rem;
                        font-size: 24px;
                    }
                }
            }
        }
    }

    .chart-container {
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        .title {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            font-size: 10px;
            line-height: 12px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #fa6400;
            margin-bottom: 6px;
        }
        .description {
            font-family: 'Lato';
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            letter-spacing: 0px;
            text-align: left;
            color: #000000;
            .selected-time-period{
                font-weight: 700;
                font-size: 14px;
            }
        }
        .chart {
            width: 100%;
            margin-top: 20px;
        }
    }

    .instances-container {
        font-family: 'Lato';
        display: flex;
        flex-direction: column;
        justify-content: center;

        .intercepts-title {
            margin-top: 16px;
            color: #fa6400;
            font-weight: 700;
            font-size: 10px;
            letter-spacing: 0.5px;
        }

        .intercepts-count {
            font-size: 40px;
            height: 48px;
            line-height: 48px;
            width: 149px;
            font-weight: 700;
            color: #000000;
        }

        .intercepts-text {
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;
        }
    }

    .top-intercept {
        margin-top: 4px;
        color: #000000;
        .title-head {
            font-family: 'Merriweather';
            width: 220px;
            font-size: 14px;
            font-weight: 900;
            line-height: 20px;
        }

        .number-head {
            width: 91px;
            font-size: 14px;
            font-weight: 900;
            line-height: 20px;
            text-align: right;
        }
        .table {
            width: 60%;
        }
        & thead {
            text-align: left;
        }
        & table td:first-child {
            width: 100%;
        }
    }

    .main-requests-container {
        margin-top: 15px;
        font-family: 'Lato';
        .title {
            font-style: normal;
            font-weight: 700;
            font-size: 10px;
            line-height: 12px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #000000;
        }

        .requests-container {
            border: 1px solid #4a4a4a;
            max-height: 153px;
            overflow: auto;

            .request {
                display: flex;
                padding-top: 0px;
                padding-bottom: 0px;
                .checkbox-list {
                    min-width: 35px;
                }
                .url {
                    max-width: 70%;
                    .text {
                        font-style: normal;
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 17px;
                        text-decoration-line: underline;
                        color: #fa6400;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .url-text {
                        color: #fa6400;
                    }
                }
                .time {
                    font-style: normal;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 17px;
                    color: #000000;
                    margin-left: auto;
                }
            }
        }
        .button {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 14px;
            border-radius: 4px;

            .add-button {
                background: #484a4f;
                padding: 20px;
                width: 80px;
                height: 48px;
                font-family: 'Lato';
                font-style: normal;
                font-weight: 500;
                font-size: 18px;
                line-height: 24px;
                align-items: center;
                text-align: center;
                color: #ffffff;
                &:hover {
                    background-color: black;
                }
            }
        }
    }

    .main-access-limited-container {
        margin-top: 16px;
        font-family: 'Lato';
        .title {
            font-style: normal;
            font-weight: 700;
            font-size: 10px;
            line-height: 12px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #fa6400;
        }

        .access-limited-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin-top: 4px;
            .content {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 17px;
                color: #000000;
            }
            .clear-button {
                margin-right: 20px;
                margin-left: 60px;
                background: #484a4f;
                width: 96px;
                height: 48px;
                font-family: 'Lato';
                font-style: normal;
                font-weight: 500;
                color: #ffffff;
                &:hover {
                    background-color: black;
                }
            }
        }
    }
`;
