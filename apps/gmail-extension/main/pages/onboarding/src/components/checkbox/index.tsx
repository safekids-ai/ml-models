import React, { ReactNode } from 'react';
import { Checkbox, FormControlLabel, styled } from '@mui/material';

type Item = {
  value: string | boolean | number;
  label: string;
};
type RadioProps = {
  name: string;
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  label: string | ReactNode;
  className?: string;
};

// Using styled components for styling
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiCheckbox-root': {
    alignSelf: 'flex-start',
    paddingTop: 0,
  },
}));

export const CheckboxField = (props: RadioProps) => {
  const { name, onChange, className, disabled, label, value } = props;
  return (
    <StyledFormControlLabel
      className={className}
      control={
        <Checkbox
          disabled={disabled}
          name={name}
          checked={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked;
            if (onChange) onChange(checked);
          }}
          color="primary"
        />
      }
      label={label}
    />
  );
};
