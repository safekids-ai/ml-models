import React, {useState} from "react";
import {includes} from "ramda";
import {CardNumberElement} from "@stripe/react-stripe-js";
import {AmexCardIcon, MasterCardIcon, VisaCardIcon} from "../../../../svgs";
import { InputElement } from "./InputElement"

export type Props = {
    className: string;
    onChange: any;
}

export const CardNumberField = ({ className, onChange }: Props) => {
    const [brand, setBrand] = useState('unknown');
    const allCards = !includes(brand, ['visa', 'mastercard', 'amex']);
    return (
        <div className={className}>
            <InputElement
                name="cardNumber"
                component={CardNumberElement}
                label="Card Number"
                placeholder="1234123412341234"
                onChange={(props: any) => {
                    const { brand } = props;
                    setBrand(brand);
                    if (onChange) onChange(props);
                }}
            />
            <div className="icons">
                {(allCards || brand === 'visa') && <VisaCardIcon />}
                {(allCards || brand === 'mastercard') && <MasterCardIcon />}
                {(allCards || brand === 'amex') && <AmexCardIcon />}
            </div>
        </div>
    );
};
