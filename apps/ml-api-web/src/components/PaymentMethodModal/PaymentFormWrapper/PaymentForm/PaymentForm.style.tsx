import styled from 'styled-components';

export const PaymentFormStyled = styled.div`
    .payment-form {
        width: 450px;
        padding-bottom: 0px;
        padding-top: 8px;
        max-width: 100%;

        .payment-methods {
            display: none; //"grid",
            grid-template-columns: repeat(2, 150px);
            grid-gap: 32px;
            justify-content: center;

            .payment-method {
                padding: 16px;
                border-radius: 6.9px;
                box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.09);
                border: solid 1px #ebecf0;
                text-align: center;
                cursor: pointer;
                &.selected {
                    border: 1px solid #fa6400;
                }
            }

            .payment-method-icons {
                display: flex;
                justify-content: space-between;
                padding-top: 16px;
            }
        }

        .fields {
            margin-top: 0px;

            .field {
                margin-top: 10px;
            }

            .card-details {
                margin-top: 10px;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-column-gap: 16px;
            }

            .card-field {
                position: relative;
                & .icons {
                    position: absolute;
                    right: 20px;
                    top: 22px;
                    & svg {
                        margin-right: 4px;
                    }
                }
            }
        }

        .buttons {
            display: grid;
            grid-template-columns: repeat(2, auto);
            justify-content: center;
            grid-column-gap: 15px;
            & button {
                min-width: 97px;
                height: 46px;
            }

            .cancel-button {
                border: 1.6px solid;
            }

            .submit-button {
                background-color: #484a4f;
                box-shadow: none !important;
                &:hover {
                    background-color: #000000;
                }
            }
        }
    }
`;
