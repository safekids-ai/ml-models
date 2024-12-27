import { Checkbox, FormControlLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Field, FieldProps } from 'formik';
import React, { ReactNode } from 'react';

type Item = {
    value: string | boolean | number;
    label: string;
};
type RadioProps = {
    name: string;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
    label: string | ReactNode;
    className?: string;
};
const useStyles = makeStyles({
    root: {
        '& .MuiCheckbox-root': {
            alignSelf: 'flex-start',
            paddingTop: '10px',
            marginTop: '-10px',
        },
    },
});
export const CheckboxField = (props: RadioProps) => {
    const { name, onChange, className, disabled, label } = props;
    const classes = useStyles();
    return (
        <Field name={name}>
            {(fieldProps: FieldProps) => {
                const {
                    field: { value = false },
                    form: { setFieldValue },
                } = fieldProps;
                return (
                    <>
                        <FormControlLabel
                            className={`${className} ${classes.root}`}
                            control={
                                <Checkbox
                                    disabled={disabled}
                                    name={name}
                                    checked={value}
                                    onChange={(event: any) => {
                                        const { checked } = event.target;
                                        setFieldValue(name, checked);
                                        if (onChange) onChange(checked);
                                    }}
                                    color="primary"
                                />
                            }
                            label={label}
                            aria-label={name}
                        />
                    </>
                );
            }}
        </Field>
    );
};
