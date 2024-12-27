import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SubmitButton } from '../../../components/InputFields';
import DatesTable from './DatesTable/DatesTable';
import { Props } from './SchoolSchedule.types';
import { format } from 'date-fns';
import { logError } from '../../../utils/helpers';
import { getRequest, postRequest } from '../../../utils/api';
import { GET_NON_SCHOOL_DAYS, GET_NON_SCHOOL_DAYS_CONFIG, POST_NON_SCHOOL_DAYS, POST_NON_SCHOOL_DAYS_CONFIG } from '../../../utils/endpoints';
import { useNotificationToast } from '../../../context/NotificationToastContext/NotificationToastContext';

const Root = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    & .MuiDialog-paperWidthSm {
        max-width: unset;
    }
    & form {
        width: 400px;
        & > div {
            margin: 8px 0;
        }
    }
`;

const Title = styled.span<{ isSettings: boolean | undefined }>`
    display: flex;
    align-items: center;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: ${(props: any) => (props.isSettings ? '15px' : '28px')};
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
`;

const Description = styled.span`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #000000;
    margin-bottom: 15px;
    width: 632px;
    margin-bottom: 35px;
`;

const ContinueButton = styled.div`
    margin-top: 50px !important;
    width: 400px;
    & button {
        margin-top: 0;
    }
    & .MuiButton-label {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        text-align: center;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }
`;

const TableContainer = styled.div`
    display: flex;
`;

const CheckboxContainer = styled.div`
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    & .MuiFormControlLabel-root {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 18px;
        color: #000000;
        height: 30px;
    }
`;

const DateSelectionContainer = styled.div`
    margin-top: 20px;
    display: flex;
`;

const DateSelection = styled.div<{ error: boolean }>`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    & div:nth-of-type(2) {
        width: 90px;
    }
    & > span {
        margin-right: 10px;
    }
    & .MuiFormControl-root {
        margin: 0px 5px;
        width: 120px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 10px;
        line-height: 12px;
        letter-spacing: 0.5px;
        & .MuiInputLabel-formControl {
            left: 15px;
        }
        & fieldset {
            border: 1px solid ${(props: any) => (props.error ? '#F7274A' : '#979797')} !important;
            border-radius: 7px;
        }
        & svg {
            display: flex;
            margin-top: 3px;
        }
        & .MuiInputLabel-shrink {
            margin: 5px 10px;
            text-transform: uppercase;
            color: #f7274a;
        }
    }
`;

const ToLabel = styled.span`
    margin-left: 30px;
`;

const AddButton = styled.div`
    & button {
        margin-left: 20px;
        & span {
            margin: 0;
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            font-size: 15px;
            line-height: 18px;
            text-align: center;
            letter-spacing: 1.25px;
        }
        height: 60px !important;
        width: 80px;
        background-color: #282828;
        color: white;
        font-size: 15px;
        height: 52px;
        letterspacing: 1.25;
        border-radius: 6.9px;
        &:hover {
            background-color: black;
        }
    }
`;

const ErrorMessage = styled.span`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
    color: #f7274a;
`;

const MenuProps = {
    PaperProps: {
        style: {
            marginTop: 55,
            height: 175,
        },
    },
};

const ErrorContainer = styled.div`
    height: 100px;
    margin-left: 100px;
    height: 40px;
    margin-left: 340px;
    margin-top: 10px;
    width: 300px;
`;

const SaveButton = styled.div`
    width: 120px;
    position: absolute;
    bottom: 50px;
    left: 700px;
    & button {
        margin-top: 0;
    }
    & .MuiButton-label {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        text-align: center;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }
`;

const SchoolSchedule = ({ nextStep, isSettings }: Props) => {
    const monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const daysArray = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
    ];
    const [weekendsEnabled, setWeekendsEnabled] = useState<boolean>(false);
    const [publicHolidaysEnabled, setHolidaysEnabled] = useState<boolean>(false);
    const [fromMonth, setFromMonth] = useState<string>('Jan');
    const [toMonth, setToMonth] = useState<string>('Jan');
    const [fromDay, setFromDay] = useState<string>('1');
    const [toDay, setToDay] = useState<string>('1');
    const [toDaysArray, setToDaysArray] = useState<string[]>(daysArray);
    const [fromDaysArray, setFromDaysArray] = useState<string[]>(daysArray);
    const [dates, setDates] = useState<string[]>([]);
    const [showError, setShowError] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
    const { showNotification } = useNotificationToast();

    useEffect(() => {
        getRequest<{}, any[]>(GET_NON_SCHOOL_DAYS, {})
            .then((res) => {
                if (res.data.length) {
                    const dateList = [];
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].endDate === res.data[i].startDate) {
                            dateList.push(`${monthsArray[+res.data[i].endDate.split('-')[1] - 1]} ${+res.data[i].endDate.split('-')[2]}`);
                        } else {
                            dateList.push(
                                `${monthsArray[+res.data[i].startDate.split('-')[1] - 1]} ${+res.data[i].startDate.split('-')[2]} - ${
                                    monthsArray[+res.data[i].endDate.split('-')[1] - 1]
                                } ${+res.data[i].endDate.split('-')[2]}`,
                            );
                        }
                    }
                    setDates(dateList);
                }
            })
            .catch((err) => {
                logError('GET NON SCHOOL DAYS', err);
            });
        if (!isSettings) {
            updateNonSchoolDaysConfig({ weekendsEnabled: true, publicHolidaysEnabled: true });
            setHolidaysEnabled(true);
            setWeekendsEnabled(true);
        } else {
            getRequest<{}, any[]>(GET_NON_SCHOOL_DAYS_CONFIG, {})
                .then((res: any) => {
                    setHolidaysEnabled(res.data.publicHolidaysEnabled);
                    setWeekendsEnabled(res.data.weekendsEnabled);
                })
                .catch((err) => {
                    logError('GET NON SCHOOL DAYS CONFIG', err);
                });
        }
    }, []);

    const onContinue = () => {
        let newDates = [];
        if (dates.length > 0) {
            newDates = [...dates].map((date: string) => {
                const startEndPoints = date.split('-').map((point: string) => point.trim());
                return {
                    startDate: `${format(new Date(`${startEndPoints[0]} 2022`), 'MM/dd/yyyy')}`,
                    endDate: `${format(new Date(`${startEndPoints[startEndPoints.length > 1 ? 1 : 0]} 2022`), 'MM/dd/yyyy')}`,
                };
            });
            setIsSubmitting(true);
            postRequest<{}, any[]>(POST_NON_SCHOOL_DAYS, newDates)
                .then(() => {
                    if (isSettings) {
                        showNotification({ type: 'success', message: 'Non School Days updated successfully.' });
                    }
                    nextStep?.();
                })
                .catch((err) => {
                    showNotification({ type: 'error', message: 'Failed to update Non School Days.' });
                    logError('POST NON SCHOOL DAYS', err);
                })
                .finally(() => setIsSubmitting(false));
        } else {
            nextStep?.();
        }
    };

    const toMonthSelect = (month: string) => {
        setIsDuplicate(false);
        setShowError(false);
        const days = [...daysArray];
        if (['Sep', 'Apr', 'Jun', 'Nov'].includes(month)) {
            days.splice(days.length - 1);
        } else if (month === 'Feb') {
            days.splice(days.length - 3);
        }
        setToDaysArray(days);
        setToMonth(month);
    };

    const fromMonthSelect = (month: string) => {
        setIsDuplicate(false);
        setShowError(false);
        const days = [...daysArray];
        if (['Sep', 'Apr', 'Jun', 'Nov'].includes(month)) {
            days.splice(days.length - 1);
        } else if (month === 'Feb') {
            days.splice(days.length - 3);
        }
        setFromDaysArray(days);
        setFromMonth(month);
    };

    const toDaySelect = (day: string) => {
        setIsDuplicate(false);
        setShowError(false);
        setToDay(day);
    };

    const fromDaySelect = (day: string) => {
        setIsDuplicate(false);
        setShowError(false);
        setFromDay(day);
    };

    const addDate = () => {
        const chronologicalError = new Date(`${toMonth} ${toDay}`) < new Date(`${fromMonth} ${fromDay}`);
        setShowError(chronologicalError);
        if (!chronologicalError) {
            const newDates = [...dates];
            const date = `${fromMonth} ${fromDay}` === `${toMonth} ${toDay}` ? `${fromMonth} ${fromDay}` : `${fromMonth} ${fromDay} - ${toMonth} ${toDay}`;
            if (!dates.includes(date)) {
                if (isDuplicateDate()) {
                    setIsDuplicate(true);
                } else {
                    newDates.push(date);
                    setDates(newDates);
                }
            } else {
                setIsDuplicate(true);
            }
        }
    };

    const removeDate = (date: string) => {
        const newDates = [...dates];
        setDates(newDates.filter((day) => day !== date));
    };

    const toggleHolidays = (value: boolean) => {
        setHolidaysEnabled(value);
        updateNonSchoolDaysConfig({ weekendsEnabled, publicHolidaysEnabled: value });
    };

    const toggleWeekends = (value: boolean) => {
        setWeekendsEnabled(value);
        updateNonSchoolDaysConfig({ weekendsEnabled: value, publicHolidaysEnabled });
    };

    const updateNonSchoolDaysConfig = (payload: any) => {
        postRequest<{}, any[]>(POST_NON_SCHOOL_DAYS_CONFIG, payload).catch((err) => {
            logError('POST NON SCHOOL DAYS', err);
        });
    };

    const isDuplicateDate = () => {
        const newDates = [...dates];
        const startPoints: any = newDates.map((date: string) => `${date.split('-')[0].trim()}`);
        const endPoints: any = newDates.map((date: string) => `${date.split('-').length > 1 ? date.split('-')[1].trim() : date.split('-')[0]}`);
        return (
            startPoints.some(
                (point: any, index: number) =>
                    new Date(`${fromMonth} ${fromDay}`) >= new Date(point) && new Date(`${fromMonth} ${fromDay}`) <= new Date(endPoints[index]),
            ) ||
            startPoints.some(
                (point: any, index: number) =>
                    new Date(`${toMonth} ${toDay}`) >= new Date(point) && new Date(`${toMonth} ${toDay}`) <= new Date(endPoints[index]),
            )
        );
    };

    return (
        <Root>
            <Title isSettings={isSettings}>School Schedule</Title>
            <Description>
                Major US holidays and weekends are already designated as non-school days. Using the form below, choose other non-school days so that your school
                can allow students more freedom on days where there is no school.
            </Description>
            <TableContainer>
                <DatesTable data={dates} removeDate={removeDate} />
                <CheckboxContainer>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={weekendsEnabled} color="primary" onChange={(evt) => toggleWeekends(evt.target.checked)} />}
                            label="Weekend Days"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={publicHolidaysEnabled} color="primary" onChange={(evt) => toggleHolidays(evt.target.checked)} />}
                            label="Major US Holidays"
                        />
                    </FormGroup>
                </CheckboxContainer>
            </TableContainer>
            <DateSelectionContainer>
                <DateSelection error={false}>
                    <span>From:</span>
                    <FormControl>
                        <InputLabel>Month</InputLabel>
                        <Select
                            MenuProps={MenuProps}
                            variant="outlined"
                            label="Month"
                            value={fromMonth}
                            onChange={(evt: any) => fromMonthSelect(evt.target.value)}
                        >
                            {monthsArray.map((month) => (
                                <MenuItem value={month}>{month}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Day</InputLabel>
                        <Select MenuProps={MenuProps} variant="outlined" label="Day" value={fromDay} onChange={(evt: any) => fromDaySelect(evt.target.value)}>
                            {fromDaysArray.map((month) => (
                                <MenuItem value={month}>{month}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DateSelection>
                <DateSelection error={showError}>
                    <ToLabel>To:</ToLabel>
                    <FormControl>
                        <InputLabel>Month</InputLabel>
                        <Select MenuProps={MenuProps} variant="outlined" label="Month" value={toMonth} onChange={(evt: any) => toMonthSelect(evt.target.value)}>
                            {monthsArray.map((month) => (
                                <MenuItem value={month}>{month}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Day</InputLabel>
                        <Select MenuProps={MenuProps} variant="outlined" label="Day" value={toDay} onChange={(evt: any) => toDaySelect(evt.target.value)}>
                            {toDaysArray.map((month) => (
                                <MenuItem value={month}>{month}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DateSelection>
                <AddButton>
                    <Button variant="contained" color="primary" onClick={() => addDate()}>
                        ADD
                    </Button>
                </AddButton>
            </DateSelectionContainer>
            <ErrorContainer>
                {showError ? (
                    <ErrorMessage>You must choose a date here chronologically after the first set of dates chosen.</ErrorMessage>
                ) : isDuplicate ? (
                    <ErrorMessage>Date already exists in the table.</ErrorMessage>
                ) : (
                    <></>
                )}
            </ErrorContainer>
            {isSettings ? (
                <SaveButton>
                    <SubmitButton isSubmitting={isSubmitting} text="Save" onClick={() => onContinue()} />
                </SaveButton>
            ) : (
                <ContinueButton>
                    <SubmitButton isSubmitting={isSubmitting} text="Continue" onClick={() => onContinue()} />
                </ContinueButton>
            )}
        </Root>
    );
};

export default SchoolSchedule;
