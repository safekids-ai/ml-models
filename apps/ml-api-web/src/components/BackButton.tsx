import React from 'react';
import { BackIcon } from '../svgs/DashboardIcons';
import { Button } from '@mui/material';

type Props = {
    className?: string;
    onClick: () => void;
    iconColor?: string;
    textColor?: string;
};
const BackButton = (props: Props) => {
  const { onClick, className, iconColor, textColor } = props;

  return (
    <Button
      className={className}
      onClick={onClick}
      sx={{
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        cursor: 'pointer',
        color: textColor,
        '& svg': {
          color: iconColor,
          marginRight: '4px',
          width: '24px',
          height: '24px',
        },
        // Default values from theme when props are not provided:
        ...(textColor === undefined && {
          color: (theme) => theme.palette.text.primary,
        }),
        ...(iconColor === undefined && {
          '& svg': {
            color: (theme) => theme.palette.primary.main,
          }
        })
      }}
    >
      <BackIcon /> Back
    </Button>
  );
};
export default BackButton;
