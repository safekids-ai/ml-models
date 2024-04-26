import React, { useState } from 'react';
import { Field, FieldProps } from 'formik';
import { makeStyles } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

import { AppTheme, customProperties } from '../../theme';

type Props = {
    name: string;
    label?: string;
    dataFieldName?: string;
    [index: string]: any;
};
const useStyles = makeStyles((theme: AppTheme) => ({
    root: {
        '&.error input': {
            borderColor: '#f44336 !important',
        },
        '& .special-label': {
            transform: 'translate(11px, 12px) scale(0.75)',
            fontSize: '16px',
            textTransform: 'uppercase',
            color: '#f7274a',
            fontFamily: 'Lato',
            left: 0,
        },
        '& .form-control': {
            width: '100%',
            height: '60px',
            paddingTop: '30px',
            paddingLeft: '72px',
        },
        '& .selected-flag .flag': {
            marginTop: '-6px !important',
            left: '24px',
        },
        '& input': {
            borderColor: `${customProperties.colors.lightPeriwinkle} !important`,
            '&:focus': {
                boxShadow: 'none !important',
            },
            '&:hover': {
                borderColor: `${customProperties.colors.text} !important`,
            },
        },
    },
}));
const PhoneField = ({ name }: Props) => {
    const [fieldValue, setField] = useState('');
    const classes = useStyles();
    return (
        <Field name={name}>
            {(fieldProps: FieldProps) => {
                const {
                    field: { value },
                    meta: { error },
                    form: { setFieldValue },
                } = fieldProps;
                return (
                    <PhoneInput
                        preferredCountries={['us', 'pk', 'in', 'ca']}
                        containerClass={`${classes.root} ${error ? 'error' : ''}`}
                        countryCodeEditable={false}
                        autoFormat={false}
                        enableSearch
                        country="us"
                        placeholder="+1 555555555"
                        value={fieldValue || value}
                        onChange={(phone, country: any, e, formattedValue) => {
                            setFieldValue(name, formattedValue === `+${country.dialCode}` ? null : formattedValue);
                            setField(phone);
                        }}
                        isValid={!!error}
                    />
                );
            }}
        </Field>
    );
};
export default PhoneField;
