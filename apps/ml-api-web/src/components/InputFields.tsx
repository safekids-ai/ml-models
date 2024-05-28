import React, {ReactNode, useState, useEffect, useMemo, useRef, ReactElement} from 'react';
import {fieldToTextField} from 'formik-mui';
import {Field, FieldProps} from 'formik';
import {IconButton, Button, TextField, Switch, useTheme, Tooltip} from '@mui/material';
import {makeStyles} from '@mui/styles'
import PinInputField from 'react-pin-field';
import {Alert} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import InfoIcon from '@mui/icons-material/Info';
import {identity, includes} from 'ramda';
import {getPasswordStrength} from '../utils/passwordStrength';
import Loader from './Loader';
import {isSomething} from '../utils/helpers';
import {AppTheme} from '../theme';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {CalendarIcon} from '../svgs';
import {CSSProperties} from '@mui/styles';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {styled} from '@mui/material/styles';

type InputProps = {
  name: string;
  label: string | ReactNode;
  className?: string;
  showClear?: boolean;
  showError?: boolean;
  [index: string]: any;
};
export const InputField: React.FC<InputProps> = (props: InputProps) => {
  const {className, showClear = false, name, disabled = false, showError = false, ...rest} = props;
  const [open, setOpen] = useState(false);
  return (
    <Field name={name}>
      {(fieldProps: FieldProps) => {
        const {
          field: {value},
          form: {setFieldValue},
        } = fieldProps;
        return (
          <TextField
            {...rest}
            {...fieldToTextField(fieldProps)}
            disabled={disabled}
            variant="outlined"
            autoComplete="off"
            fullWidth
            className={`input-field ${className}`}
            {...(showError ? {} : {helperText: ''})}
            SelectProps={{
              open,
              onOpen: () => setOpen(true),
              onClose: () => setOpen(false),
              MenuProps: {
                anchorOrigin: {vertical: 'bottom', horizontal: 'center'},
                transformOrigin: {vertical: 'top', horizontal: 'center'},
              },
            }}
            {...(showClear && !!value
              ? {
                InputProps: {
                  endAdornment: (
                    <ClearFieldButton
                      onClick={() => {
                        setFieldValue(name, '');
                      }}
                      visible={!!value}
                    />
                  ),
                },
              }
              : null)}
          />
        );
      }}
    </Field>
  );
};

type SelectProps = {
  name: string;
  label: string | ReactNode;
  className?: string;
  showClear?: boolean;
  renderValue?: (value: any) => any;
  variant?: any;
  multiple?: boolean;
  onKeyPress?: (event: any) => void;
  [index: string]: any;
};
export const SelectField: React.FC<SelectProps> = (props: SelectProps) => {
  const {
    className,
    showClear = false,
    name,
    renderValue,
    variant = 'outlined',
    multiple = false,
    onKeyPress,
    ...rest
  } = props;
  const ref = useRef<any>(null);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);

  let width = 0;
  let leftDiff = 0;
  if (ref.current) {
    width = ref.current.clientWidth;
    const innerSelect = ref.current.getElementsByClassName('MuiSelect-root')[0];
    const innerWidth = innerSelect.clientWidth;
    leftDiff = (width - innerWidth) / 2;
  }
  useEffect(
    function onOpen() {
      setRefresh(open);
    },
    [open, setRefresh]
  );
  useEffect(() => {
    const element = document.getElementById('menu-' + name);
    if (element) {
      const dropdown = element.getElementsByClassName('MuiMenu-paper')[0] as HTMLElement;
      if (dropdown && dropdown.style) {
        dropdown.classList.add('mui-select-dropdown');
        dropdown.style.left = parseInt(dropdown.style.left, 10) - leftDiff + 'px !important';
        dropdown.style.minWidth = width + 'px';
      }
    }
  }, [width, leftDiff, refresh, name]);
  const forwardedProps = variant === 'outlined' ? {} : {disableUnderline: true};
  return (
    <Field name={name}>
      {(fieldProps: FieldProps) => {
        const {
          field: {value},
          form: {setFieldValue},
        } = fieldProps;
        return (
          <TextField
            {...rest}
            {...fieldToTextField(fieldProps)}
            select
            variant={variant}
            autoComplete="off"
            fullWidth
            className={`input-field ${className}`}
            helperText=""
            ref={ref}
            SelectProps={{
              ...(rest.SelectProps || {}),
              multiple,
              renderValue,
              open,
              onOpen: (e: any) => {
                const deleteButton = e?.target?.closest('.MuiChip-deleteIcon');
                if (!deleteButton) setOpen(true);
              },
              onClose: () => setOpen(false),
              MenuProps: {
                getContentAnchorEl: null,
                anchorOrigin: {vertical: 'bottom', horizontal: 'center'},
                transformOrigin: {vertical: 'top', horizontal: 'center'},
                anchorEl: ref.current,
              },
            }}
            {...(!!value && showClear
              ? {
                InputProps: {
                  ...forwardedProps,
                  endAdornment: (
                    <ClearFieldButton
                      onClick={() => {
                        setFieldValue(name, '');
                      }}
                      visible={!!value}
                    />
                  ),
                },
              }
              : {
                InputProps: {
                  ...forwardedProps,
                  endAdornment: !open ? (
                    <ExpandMore className="select-icon" onClick={() => setOpen(true)}/>
                  ) : (
                    <ExpandLess className="select-icon" onClick={() => setOpen(false)}/>
                  ),
                  onKeyPress,
                },
              })}
          />
        );
      }}
    </Field>
  );
};

type SelectDropdownProps = {
  name: string;
  label: string | ReactNode;
  className?: string;
  showClear?: boolean;
  renderValue?: (value: any) => any;
  variant?: any;
  multiple?: boolean;
  onKeyPress?: (event: any) => void;
  onChange: any;
  [index: string]: any;
};
export const SelectDropdown: React.FC<SelectDropdownProps> = (props: SelectDropdownProps) => {
  const {
    className,
    showClear = false,
    name,
    renderValue,
    variant = 'outlined',
    multiple = false,
    onKeyPress,
    ...rest
  } = props;
  const ref = useRef<any>(null);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);

  let width = 0;
  let leftDiff = 0;
  if (ref.current) {
    width = ref.current.clientWidth;
    const innerSelect = ref.current.getElementsByClassName('MuiSelect-root')[0];
    const innerWidth = innerSelect.clientWidth;
    leftDiff = (width - innerWidth) / 2;
  }
  useEffect(
    function onOpen() {
      setRefresh(open);
    },
    [open, setRefresh]
  );
  useEffect(() => {
    const element = document.getElementById('menu-' + name);
    if (element) {
      const dropdown = element.getElementsByClassName('MuiMenu-paper')[0] as HTMLElement;
      if (dropdown && dropdown.style) {
        dropdown.classList.add('mui-select-dropdown');
        dropdown.style.left = parseInt(dropdown.style.left, 10) - leftDiff + 'px !important';
        dropdown.style.minWidth = width + 'px';
      }
    }
  }, [width, leftDiff, refresh, name]);
  const forwardedProps = variant === 'outlined' ? {} : {disableUnderline: true};
  return (
    <TextField
      {...rest}
      // {...fieldToTextField(fieldProps)}
      name={name}
      select
      variant={variant}
      autoComplete="off"
      fullWidth
      className={`input-field ${className}`}
      helperText=""
      ref={ref}
      SelectProps={{
        ...(rest.SelectProps || {}),
        multiple,
        renderValue,
        open,
        onOpen: (e: any) => {
          const deleteButton = e?.target?.closest('.MuiChip-deleteIcon');
          if (!deleteButton) setOpen(true);
        },
        onClose: () => setOpen(false),
        MenuProps: {
          getContentAnchorEl: null,
          anchorOrigin: {vertical: 'bottom', horizontal: 'center'},
          transformOrigin: {vertical: 'top', horizontal: 'center'},
          anchorEl: ref.current,
        },
      }}
      {...(showClear
        ? {
          InputProps: {
            ...forwardedProps,
            endAdornment: <ClearFieldButton onClick={() => {
            }}/>,
          },
        }
        : {
          InputProps: {
            ...forwardedProps,
            endAdornment: !open ? (
              <ExpandMore className="select-icon" onClick={() => setOpen(true)}/>
            ) : (
              <ExpandLess className="select-icon" onClick={() => setOpen(false)}/>
            ),
            onKeyPress,
          },
        })}
    />
  );
};

type CustomSelectProps = {
  name: string;
  label: string | ReactNode;
  className?: string;
  showClear?: boolean;
  onChange?: any;
  renderValue?: (value: any) => any;
  variant?: any;
  multiple?: boolean;
  onKeyPress?: (event: any) => void;
  [index: string]: any;
};
export const CustomSelectField: React.FC<CustomSelectProps> = (props: CustomSelectProps) => {
  const {
    className,
    showClear = false,
    name,
    renderValue,
    variant = 'outlined',
    multiple = false,
    onKeyPress,
    ...rest
  } = props;
  const ref = useRef<any>(null);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);

  let width = 0;
  let leftDiff = 0;
  if (ref.current) {
    width = ref.current.clientWidth;
    const innerSelect = ref.current.getElementsByClassName('MuiSelect-root')[0];
    const innerWidth = innerSelect.clientWidth;
    leftDiff = (width - innerWidth) / 2;
  }
  useEffect(
    function onOpen() {
      setRefresh(open);
    },
    [open, setRefresh]
  );
  useEffect(() => {
    const element = document.getElementById('menu-' + name);
    if (element) {
      const dropdown = element.getElementsByClassName('MuiMenu-paper')[0] as HTMLElement;
      if (dropdown && dropdown.style) {
        dropdown.classList.add('mui-select-dropdown');
        dropdown.style.left = parseInt(dropdown.style.left, 10) - leftDiff + 'px !important';
        dropdown.style.minWidth = width + 'px';
      }
    }
  }, [width, leftDiff, refresh, name]);
  const forwardedProps = variant === 'outlined' ? {} : {disableUnderline: true};
  return (
    <Field name={name}>
      {(fieldProps: FieldProps) => {
        const {
          field: {value},
          form: {setFieldValue},
        } = fieldProps;
        return (
          <TextField
            {...rest}
            {...fieldToTextField(fieldProps)}
            select
            variant={variant}
            autoComplete="off"
            fullWidth
            className={`input-field ${className}`}
            helperText=""
            ref={ref}
            SelectProps={{
              ...(rest.SelectProps || {}),
              multiple,
              renderValue,
              open,
              onChange(event, child) {
                console.log('event >', event);
                rest.onChange(event);
              },
              onOpen: (e: any) => {
                const deleteButton = e?.target?.closest('.MuiChip-deleteIcon');
                if (!deleteButton) setOpen(true);
              },
              onClose: () => setOpen(false),
              MenuProps: {
                getContentAnchorEl: null,
                anchorOrigin: {vertical: 'bottom', horizontal: 'center'},
                transformOrigin: {vertical: 'top', horizontal: 'center'},
                anchorEl: ref.current,
              },
            }}
            {...(!!value && showClear
              ? {
                InputProps: {
                  ...forwardedProps,
                  endAdornment: (
                    <ClearFieldButton
                      onClick={() => {
                        setFieldValue(name, '');
                      }}
                      visible={!!value}
                    />
                  ),
                },
              }
              : {
                InputProps: {
                  ...forwardedProps,
                  endAdornment: !open ? (
                    <ExpandMore className="select-icon" onClick={() => setOpen(true)}/>
                  ) : (
                    <ExpandLess className="select-icon" onClick={() => setOpen(false)}/>
                  ),
                  onKeyPress,
                },
              })}
          />
        );
      }}
    </Field>
  );
};

type SwitchProps = {
  name: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  [property: string]: any;
};
export const SwitchField = (props: SwitchProps) => {
  const {name, onChange, disabled, ...rest} = props;
  return (
    <Field name={name}>
      {(fieldProps: FieldProps) => {
        const {
          field: {value},
          form: {setFieldValue},
        } = fieldProps;
        return (
          <Switch
            {...rest}
            value={value}
            disabled={disabled}
            checked={value || false}
            onChange={(event: any) => {
              const {checked} = event.target;
              setFieldValue(name, checked);
              onChange(checked);
            }}
          />
        );
      }}
    </Field>
  );
};

type PasswordStrengthBarProps = {
  password: string;
  barCount?: number;
  onStrengthChange?: (strength: number) => void;
  className?: string;
};
const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({
                                                                   password,
                                                                   barCount = 8,
                                                                   onStrengthChange
                                                                 }: PasswordStrengthBarProps) => {
  const score = useMemo(() => getPasswordStrength(password), [password]);
  useEffect(
    function onScoreChange() {
      if (onStrengthChange) onStrengthChange(score);
    },
    [score, onStrengthChange]
  );
  const bars: ReactNode[] = [];
  for (let i = 0; i < barCount; i++) {
    bars.push(<div key={i}
                   className={`password-strength-bar-item ${score > i * (100 / barCount) ? 'colored' : ''}`}></div>);
  }
  return <div className="password-strength-bar">{bars.map(identity)}</div>;
};

type PasswordProps = {
  name: string;
  label: string | ReactNode;
  className?: string;
  showStrengthBar?: boolean;
  onStrengthChange?: (strength: number) => void;
  removeSpaces?: boolean;
  showCriteria?: boolean;
  infoStyle?: CSSProperties;
  [index: string]: any;
};

const usePasswordStyles = makeStyles((theme: AppTheme) => ({
  root: {
    '& input::-ms-reveal, & input::-ms-clear': {
      display: 'none !important',
    },
    '& .toggle-visibility': {
      padding: 0,
      color: theme.palette.primary.main,
      '& svg': {
        width: '16px',
        height: '16px',
      },
    },
    '& + .password-strength-bar': {
      width: '60%',
      margin: '15px auto 0px',
      display: 'grid',
      gridGap: '4px',
      borderRadius: '2px',
      gridTemplateColumns: 'repeat(8,1fr)',
      '& > .password-strength-bar-item': {
        flex: '1',
        height: '4px',
        width: '100%',
        background: theme.colors.veryLightBlue,
        '&.colored': {
          background: '#3ad29f',
        },
      },
      '& > div > div': {
        height: '4px !important',
      },
      '& p': {
        display: 'none',
      },
    },
  },
}));

export const PasswordField: React.FC<PasswordProps> = (props: PasswordProps) => {
  const {
    className,
    name,
    label,
    showStrengthBar = false,
    onStrengthChange,
    removeSpaces = false,
    showCriteria = false,
    infoStyle = {},
    ...rest
  } = props;
  const [visible, setVisible] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const classes = usePasswordStyles();
  return (
    <Field name={name} label={label}>
      {(fieldProps: FieldProps) => {
        const formikProps = fieldToTextField(fieldProps);
        return (
          <div style={{position: 'relative'}}>
            <TextField
              {...rest}
              {...fieldProps}
              {...formikProps}
              onChange={(e) => {
                const {value} = e.target;
                if (formikProps.onChange) {
                  if (removeSpaces) {
                    e.target.value = value.replace(/\s/g, '');
                  }
                  formikProps.onChange(e);
                }
                if (includes(' ', value)) {
                  setTooltipOpen(true);
                } else if (tooltipOpen) {
                  setTooltipOpen(false);
                }
              }}
              variant="outlined"
              autoComplete="off"
              fullWidth
              label={label}
              type={visible ? 'text' : 'password'}
              helperText=""
              className={`input-field ${classes.root} ${className}`}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setVisible(!visible)}
                    className="toggle-visibility"
                    size="large">
                    {visible ? <VisibilityOff/> : <Visibility/>}
                  </IconButton>
                ),
              }}
            />
            {showStrengthBar && (
              <PasswordStrengthBar className="password-strength-bar" password={fieldProps.field.value}
                                   onStrengthChange={onStrengthChange}/>
            )}
            {showCriteria && (
              <div
                style={{
                  position: 'absolute',
                  right: '-30px',
                  top: 'calc(50% - 12px)',
                  ...infoStyle,
                }}>
                <Tooltip
                  onClose={() => setTooltipOpen(false)}
                  open={tooltipOpen}
                  title={
                    <div style={{fontSize: '11px'}}>
                      Your password should be between 8-20 characters and must be a combination of small letters,
                      capital letters and
                      numbers.
                      <br/>
                      Spaces are not allowed
                    </div>
                  }>
                  <InfoIcon onMouseOver={() => setTooltipOpen(true)}/>
                </Tooltip>
              </div>
            )}
          </div>
        );
      }}
    </Field>
  );
};

const PinInputContainerStyle = styled('div')<{ length: number }>(({ theme, length }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${length}, 1fr)`,
  gridGap: '10px',
  maxWidth: '410px',
  margin: 'auto',
}));

const PinInputFieldStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '60px',
  height: '60px',
  borderRadius: '6.9px',
  border: 'solid 1px lightblue', // Use your theme color here
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '16px',
  textAlign: 'center',
};

type PinProps = {
  length?: number;
  onComplete?: (code: string) => void;
  onChange?: (code: string) => void;
  [index: string]: any;
};

export const PinField: React.FC<PinProps> = (props: PinProps) => {
  const {length = 6, ...restProps} = props;
  return (
    <PinInputContainerStyle length={length}>
      <PinInputField length={length} {...restProps} style={PinInputFieldStyle} />
    </PinInputContainerStyle>
  );
};

type DateFieldProps = {
  name: string;
  label: string;
  openTo?: 'year' | 'day' | 'month' | undefined;
  views?: ('year' | 'day' | 'month')[];
  format?: string;
  showClear?: boolean;
  onlyDay?: boolean;
  [index: string]: any;
};
export const DateField = ({
                            name,
                            label,
                            openTo = 'year',
                            views,
                            format = 'yyyy',
                            showClear = false,
                            onlyDay = true,
                            readOnly = false,
                            ...rest
                          }: DateFieldProps) => {
  const theme = useTheme();
  return (
    <Field name={name}>
      {(fieldProps: FieldProps) => {
        const {
          field: {value},
          meta: {touched, error},
          form: {setFieldValue},
        } = fieldProps;
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              //ABBAS FIX ME inputVariant="outlined"
              //ABBAS FIX ME style={{width: '100%'}}
              disableFuture
              //ABBAS FIX ME showTodayButton
              readOnly={readOnly}
              {...rest}
              className="input-field date-field"
              value={value}
              format={format}
              onChange={(date) => {
                const newDate = date;
                if (onlyDay) {
                  newDate?.setHours(0);
                  newDate?.setMinutes(0);
                  newDate?.setSeconds(0);
                }
                setFieldValue(name, newDate);
              }}
              name={name}
              label={label}
              openTo={openTo}
              //ABBAS FIX ME error={!!error && touched}

              //   InputProps={{
              //     disableUnderline: true,
              //     endAdornment:
              //       value && showClear ? (
              //         <ClearFieldButton
              //           onClick={() => {
              //             setFieldValue(name, null);
              //           }}
              //           visible
              //         />
              //       ) : (
              //         <CalendarIcon color={readOnly ? '#b1b1b1' : theme.palette.primary.main}/>
              //       ),
              //   }}
              //   views={views}
            />
          </LocalizationProvider>
        );
      }}
    </Field>
  );
};
type ClearFieldProps = {
  onClick: () => void;
  visible?: boolean;
};
const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '100%',
    padding: '4px',
    height: '16px',
    width: '16px',
    lineHeight: '16px',
    fontSize: '10px',
    textAlign: 'center',
    boxSizing: 'border-box',
    visibility: (props: ClearFieldProps) => (props.visible ? 'visible' : 'hidden'),
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    '& svg': {
      width: '12px',
      height: '12px',
    },
  },
}));
export const ClearFieldButton: React.FC<ClearFieldProps> = (props: ClearFieldProps) => {
  const classes = useStyles(props);
  const {onClick} = props;
  return (
    <div
      className={`clear-field ${classes.root}`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}>
      <CloseIcon/>
    </div>
  );
};
type ButtonProps = {
  text?: string;
  className?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  marginTop?: number | string;
  marginBottom?: number | string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  id?: string;
};
const useButtonStyles = makeStyles((theme) => ({
  actionBtn: ({marginTop = '70px', marginBottom}: ButtonProps) => ({
    marginTop,
    marginBottom,
    height: '60px',
    borderRadius: 6.93,
    '&.Mui-disabled, &:hover.Mui-disabled': {
      boxShadow: ({isSubmitting}: ButtonProps) =>
        isSubmitting ? '0 12px 40px -10px rgba(247, 39, 74, 0.5)' : '0 12px 40px -10px rgba(193, 199, 208, 0.5)',
      backgroundColor: ({isSubmitting}: ButtonProps) => (isSubmitting ? theme.palette.primary.main : '#c1c7d0'),
      color: '#fff',
    },
  }),
}));
export const SubmitButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    text = 'Submit',
    className = '',
    isSubmitting = false,
    disabled = false,
    marginTop = '70px',
    marginBottom,
    onClick,
    id
  } = props;
  const classes = useButtonStyles({isSubmitting, marginTop, marginBottom});
  return (
    <Button
      id={id}
      fullWidth
      variant="contained"
      color="primary"
      className={`${classes.actionBtn} ${className}`}
      disabled={disabled || isSubmitting}
      type="submit"
      onClick={onClick}>
      {isSubmitting ? <Loader/> : text}
    </Button>
  );
};

type MessageContainerProps = {
  height?: string | number;
  message?: undefined | string | ReactElement;
  status?: 'success' | 'info' | 'warning' | 'error' | undefined;
};
const useMessageStyles = makeStyles({
  root: {
    height: ({height}: MessageContainerProps) => height,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiAlert-root': {
      minHeight: '36px',
      padding: '11px 16px',
      '& .MuiAlert-icon': {
        padding: 0,
        fontSize: '16px',
      },
      '& .MuiAlert-message': {
        padding: 0,
        fontSize: '11px',
      },
    },
  },
});
export const MessageContainer: React.FC<MessageContainerProps> = ({
                                                                    message,
                                                                    status,
                                                                    height = '70px'
                                                                  }: MessageContainerProps) => {
  const classes = useMessageStyles({message, status, height});
  return <div className={classes.root}>{isSomething(message) && <Alert severity={status}>{message}</Alert>}</div>;
};
