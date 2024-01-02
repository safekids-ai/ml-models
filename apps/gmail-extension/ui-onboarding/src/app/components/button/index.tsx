import React from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Loader from '../loader';

type ButtonProps = {
  text?: string;
  className?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  marginTop?: number | string;
  marginBottom?: number | string;
  onClick?: () => void;
  id?: string;
};

// Styled button with dynamic props
const ActionButton = styled(Button)<ButtonProps>(
  ({ theme, marginTop = "70px", marginBottom, isSubmitting }) => ({
    marginTop,
    marginBottom,
    height: "60px",
    borderRadius: 6.93,
    boxShadow: "0 12px 40px -10px rgba(89,57,250,0.5)",
    '&.Mui-disabled, &:hover.Mui-disabled': {
      boxShadow: isSubmitting
        ? "0 12px 40px -10px rgba(89,57,250,0.5)"
        : "0 12px 40px -10px rgba(193, 199, 208, 0.5)",
      backgroundColor: isSubmitting ? theme.palette.primary.main : "#c1c7d0",
      color: "#fff",
    },
  })
);

export const SubmitButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    text = "Submit",
    className = "",
    isSubmitting = false,
    disabled = false,
    onClick,
    id,
  } = props;

  return (
    <ActionButton
      id={id}
      fullWidth
      variant="contained"
      color="primary"
      className={className}
      disabled={disabled || isSubmitting}
      type="submit"
      onClick={onClick}
      {...props} // Spread the rest of the props for dynamic styles
    >
      {isSubmitting ? <Loader /> : text}
    </ActionButton>
  );
};
