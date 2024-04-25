import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { Field, FieldProps } from 'formik';
import React from 'react';

type Item = {
    value: string | boolean | number;
    label: string;
};
type RadioProps = {
    name: string;
    onChange?: (value: string | boolean | number) => void;
    disabled?: boolean;
    items: Item[];
    horizontal?: boolean;
    className?: string;
};
export const RadioField = (props: RadioProps) => {
    const { name, onChange, horizontal = true, className, disabled, items } = props;
    return (
        <Field name={name}>
            {(fieldProps: FieldProps) => {
                const {
                    field: { value = '' },
                    form: { setFieldValue },
                } = fieldProps;
                return (
                    <>
                        <RadioGroup
                            aria-label={name}
                            name={name}
                            value={value}
                            className={className}
                            style={horizontal ? { flexDirection: 'row' } : {}}
                            onChange={(event: any) => {
                                const { value } = event.target;
                                setFieldValue(name, value);
                                if (onChange) onChange(value);
                            }}
                        >
                            {items.map((item, index) => {
                                return <FormControlLabel disabled={disabled} key={index} value={item.value} control={<Radio />} aria-label={`${name}-${item.label}`} label={item.label} />;
                            })}
                        </RadioGroup>
                    </>
                );
            }}
        </Field>
    );
};
