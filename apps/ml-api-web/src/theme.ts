import {
  Theme,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';

const accountType = localStorage.getItem('account_type');
const primaryColor = accountType === 'SCHOOL' ? '#f7274a' : '#fa6400';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {
  }
}

export const customProperties = {
  font: {
    heading: 'Merriweather',
  },
  colors: {
    lightGrey: '#c1c7d0',
    veryLightBlue: '#ebecf0',
    lightPeriwinkle: '#dfe1e6',
    seaweedGreen: '#36b37e',
    red: '#de350b',
    paleGrey: '#f4f5f7',
    text: '#4a4a4a',
    brownGrey: '#b1b1b1',
    silver: '#afe1cb',
    maize: '#ffc44d',
    veryLightPink: '#fcebe7',
    primaryColor,
  },
};
export type AppTheme = Theme & { colors: { [index: string]: string } };
const initialTheme = createTheme();
export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
  },
  typography: {
    fontFamily: ['Lato', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(', '),
    h1: {
      fontFamily: 'Merriweather, "Roboto", "Helvetica", "Arial", sans-serif ',
      fontWeight: 900,
      fontSize: '36px',
    },
    h2: {
      fontFamily: 'Merriweather, "Roboto", "Helvetica", "Arial", sans-serif ',
      fontWeight: 900,
    },
    h3: {
      fontFamily: 'Merriweather, "Roboto", "Helvetica", "Arial", sans-serif ',
      fontWeight: 900,
    },
    h4: {
      fontFamily: 'Merriweather, "Roboto", "Helvetica", "Arial", sans-serif ',
      fontWeight: 900,
      fontSize: '28px',
    },
    h5: {
      fontFamily: 'Merriweather, "Roboto", "Helvetica", "Arial", sans-serif ',
      fontWeight: 900,
      fontSize: '18px',
    },
    h6: {
      fontFamily: 'Merriweather, "Roboto", "Helvetica", "Arial", sans-serif ',
      fontWeight: 900,
      fontSize: '15px',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          WebkitFontSmoothing: 'auto',
        },
        body: {
          color: customProperties.colors.text
        }, // Remove body styles (already set in palette)
        '.flex-wrap': {
          flexWrap: 'wrap',
        },
        '.flex-with-center': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        '.text-button': { // Use typography for font styles
          fontFamily: 'Lato',
          fontSize: '14px',
          fontWeight: 'normal',
        },
        '.primary-text': {
          color: primaryColor,
          fontWeight: 'normal !important',
        },
        '.cursor-pointer': {
          cursor: 'pointer',
        },
        '.App': {
          minHeight: '100vh',
        },
        a: {
          textDecoration: 'none',
        },
        MuiSelect: { // Override MuiSelect instead of targeting specific class
          '& .MuiList-root.MuiList-padding': { // Use selectors within component
            marginTop: 3,
            borderRadius: '6.9px',
            border: `1px solid ${customProperties.colors.lightPeriwinkle}`,
            padding: 15,
            '& .MuiListItem-root': {
              padding: 16,
            },
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        // Set default props for MuiTextField here (e.g., fontFamily: 'Lato')
      },
      styleOverrides: {
        root: {
          fontFamily: 'Lato',
          minHeight: '60px', // Set directly on root
          '& .MuiInputLabel-outlined': { // Use selectors within component
            transform: 'translate(22px, 20px)',
            color: '#b1b1b1',
          },
          '& .MuiInputLabel-root.MuiInputLabel-shrink': { // Use selectors within component
            transform: 'translate(22px, 12px) scale(0.75)',
            textTransform: 'uppercase',
            color: primaryColor, // Assuming primaryColor is defined elsewhere
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: '60px', // Set directly on root
          '& .Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': { // Use selectors
            borderColor: customProperties.colors.lightPeriwinkle,
          },
        },
        input: {
          padding: '29px 22px 12px',
          height: '19px', // Set directly on input
        },
        /* focused: {},  // No styles needed for focused state in v6 */  // Removed unnecessary prop
        notchedOutline: {
          top: 0, // Set directly on notchedOutline
          borderColor: customProperties.colors.lightPeriwinkle,
          '& legend': {
            display: 'none',
          },
        },
        adornedEnd: {
          paddingRight: '22px', // Set directly on adornedEnd
        },
      },
    },
    MuiButton: {
      defaultProps: {
        // Set default props for MuiButton here (e.g., variant: 'contained')
      },
      styleOverrides: {
        root: {
          textTransform: 'initial',
          fontFamily: 'Fira Sans',
          fontSize: 15, // Use numeric value for font size
          fontWeight: 500,
        },
        text: { // No need for nested selector in v6
          textTransform: 'initial',
        },
        outlined: {
          border: '1px solid',
          color: customProperties.colors.text,
        },
        contained: {
          sx: {
            transform: 'uppercase', // Applies uppercase text transform
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          display: 'none', // Hide default icon
        },
        select: {
          '&:focus': { // Override focus styles
            background: 'none !important', // Remove background on focus
          },
        },
        root: {
          fill:  '#b1b1b1',
          cursor: 'pointer',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 26,
          height: 12,
          padding: 0,
          display: 'flex',
        },
        switchBase: {
          padding: 1, // Adjust padding as needed
          color: initialTheme.palette.grey[500],
          '&.Mui-checked': { // Use Mui-checked class instead of custom $checked
            transform: 'translateX(12px)',
            color: initialTheme.palette.common.white,
            '& + .MuiSwitch-track': { // Use MuiSwitch-track class for selector
              opacity: 1,
              backgroundColor: primaryColor, // Assuming primaryColor is defined elsewhere
              borderColor: primaryColor,
            },
            '& .MuiSwitch-thumb': { // Use MuiSwitch-thumb class for selector
              background: initialTheme.palette.common.white,
            },
          },
        },
        thumb: {
          width: 10,
          height: 10,
          boxShadow: 'none',
        },
        track: {
          border: `1px solid ${initialTheme.palette.grey[500]}`,
          borderRadius: 12 / 2,
          opacity: 1,
          backgroundColor: initialTheme.palette.common.white,
        },
        checked: {}, // No styles needed for checked state in v6
      },
    }
  }
}, customProperties);
