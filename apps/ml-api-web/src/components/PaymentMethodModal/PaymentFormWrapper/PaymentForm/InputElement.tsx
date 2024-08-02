import React, {useCallback, useImperativeHandle, useRef, useState} from "react";
import {Field, FieldProps} from "formik";
import {TextField} from "@mui/material";

export type Props = {
    component: any;
    placeholder: string;
    label: string;
    onChange: any;
    name: string;
}


const StripeInput = ({ component: Component, inputRef, ...props }: any) => {
    const elementRef = useRef<any>();
    useImperativeHandle(inputRef, () => ({
        focus: () => elementRef.current?.focus,
        blur: () => elementRef.current?.blur,
    }));
    return <Component onReady={(element: any) => (elementRef.current = element)} {...props} />;
};
export const InputElement = ({ component, placeholder, label, onChange: onChangeCallback, name }: Props) => {
    const [empty, setEmpty] = useState(true);
    const [shrink, setShrink] = useState(false);
    const [error, setError] = useState(true);
    const onChange = useCallback(
        (props) => {
            const { empty, complete, value, error, ...rest } = props;
            console.log('Change', empty, complete, value, rest);
            setError(!!error);
            if (!empty) setShrink(true);
            setEmpty(empty);
            if (onChangeCallback) onChangeCallback(props);
        },
        [setShrink, setEmpty, setError, onChangeCallback]
    );
    const onFocus = useCallback(() => {
        setShrink(true);
    }, [setShrink]);
    const onBlur = useCallback(
        (setFieldTouched: any) => {
            if (empty) setShrink(false);
            setFieldTouched(name, true);
        },
        [setShrink, empty, name]
    );
    return (
        <Field name={name}>
            {(fieldProps: FieldProps) => (
                <TextField
                    label={label}
                    variant="outlined"
                    autoComplete="off"
                    fullWidth
                    error={fieldProps.meta.touched && (error || !!fieldProps.meta.error)}
                    className={`input-field`}
                    helperText=""
                    InputLabelProps={{ shrink }}
                    InputProps={{
                        inputComponent: StripeInput,
                        inputProps: {
                            component,
                            onChange,
                            options: {
                                placeholder: shrink ? placeholder : ' ',
                                style: { invalid: { color: '#4a4a4a' } },
                            },
                            onFocus,
                            onBlur: () => onBlur(fieldProps.form.setFieldTouched),
                        },
                    }}
                />
            )}
        </Field>
    );
};