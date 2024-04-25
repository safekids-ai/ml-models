import {
    Theme,
} from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles'
const accountType = localStorage.getItem('account_type');
const primaryColor = accountType === 'SCHOOL' ? '#f7274a' : '#fa6400';

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
export const theme = createTheme(
    {
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
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    html: {
                        WebkitFontSmoothing: 'auto',
                    },
                    body: {
                        color: customProperties.colors.text,
                    },
                    '.flex-wrap': {
                        flexWrap: 'wrap',
                    },
                    '.flex-with-center': {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    '.text-button': {
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
                    '.mui-select-dropdown': {
                        boxShadow: 'none ',
                        '& .MuiList-root.MuiList-padding': {
                            marginTop: '3px',
                            borderRadius: '6.9px',
                            border: `1px solid ${customProperties.colors.lightPeriwinkle}`,
                            padding: '15px',
                            '& .MuiListItem-root': {
                                padding: '16px',
                            },
                        },
                    },
                },
            },
            MuiTextField: {
                root: {
                    fontFamily: 'Lato',
                    minHeight: '60px',
                    '& .MuiInputLabel-outlined': {
                        transform: 'translate(22px, 20px)',
                        color: '#b1b1b1',
                    },
                    '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                        transform: 'translate(22px, 12px) scale(0.75)',
                        textTransform: 'uppercase',
                        color: primaryColor,
                    },
                },
            },
            MuiOutlinedInput: {
                root: {
                    height: '60px',
                    '&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
                        borderColor: customProperties.colors.lightPeriwinkle,
                    },
                },
                input: {
                    padding: '29px 22px 12px',
                    height: '19px',
                },
                focused: {},
                notchedOutline: {
                    top: 0,
                    borderColor: customProperties.colors.lightPeriwinkle,
                    '& legend': {
                        display: 'none',
                    },
                },
                adornedEnd: {
                    paddingRight: '22px',
                },
            },
            MuiButton: {
                root: {
                    textTransform: 'initial',
                    fontFamily: 'Fira Sans',
                    fontSize: '15px',
                    fontWeight: 500,
                },
                text: {
                    '& .MuiButton-label': {
                        textTransform: 'initial',
                    },
                },
                outlined: {
                    border: '1px solid',
                    color: customProperties.colors.text,
                },
                label: {
                    textTransform: 'uppercase',
                },
            },
            MuiSelect: {
                icon: {
                    display: 'none',
                },
                select: {
                    '&:focus': {
                        background: 'none !important',
                    },
                },
                root: {
                    '&~ .select-icon': {
                        fill: '#b1b1b1',
                        cursor: 'pointer',
                    },
                },
            },
            MuiSwitch: {
                root: {
                    width: 26,
                    height: 12,
                    padding: 0,
                    display: 'flex',
                },
                switchBase: {
                    padding: 1,
                    color: initialTheme.palette.grey[500],
                    '&$checked': {
                        transform: 'translateX(12px)',
                        color: initialTheme.palette.common.white,
                        '& + $track': {
                            opacity: 1,
                            backgroundColor: primaryColor,
                            borderColor: primaryColor,
                        },
                        '& $thumb': {
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
                checked: {},
            },
        },
    },
    customProperties
);
