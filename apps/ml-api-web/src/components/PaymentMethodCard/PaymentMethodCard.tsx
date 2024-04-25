import React from 'react';
import { PaymentMethodCardStyled } from './PaymentMethodCard.style';
import { Button } from '@material-ui/core';

type Props = {
    lastDigits: string;
    nextInvoiceDate?: string;
    expiryMonth: number;
    expiryYear?: number;
    onChange: (e: React.MouseEvent<HTMLElement>) => void;
};

export const PaymentMethodCard = (props: Props) => {
    const { lastDigits, expiryMonth, expiryYear, onChange } = props;
    const hasPaymentMethod = lastDigits && expiryMonth && expiryYear;
    return (
        <PaymentMethodCardStyled>
            <div className="top-container">
                <span className="heading">PAYMENT</span>
                <span className="text">
                    {`${
                        hasPaymentMethod
                            ? 'The card you provided is currently being charged.'
                            : `Currently, you don't have any payment method. Please add a payment method.`
                    }`}
                </span>
                {hasPaymentMethod ? <span className="text">{`**** **** **** ${lastDigits} - Ex Date ${expiryMonth}/${expiryYear}`}</span> : <span />}
            </div>
            <Button className="button" type="submit" onClick={onChange}>
                CHANGE
            </Button>
        </PaymentMethodCardStyled>
    );
};
