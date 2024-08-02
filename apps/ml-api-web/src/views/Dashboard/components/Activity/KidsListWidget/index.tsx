import React from 'react';
import { format } from 'date-fns';
import { Button, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { history } from '../../../../../utils/api';
import { KidWidgetType } from '../SchoolActivity.type';
import { CrisisEngagementSection } from './kidsListWidget.style';

const useStyles = makeStyles({
    root: {
        width: '100%',
        margin: '17px 0',
        height: 235,
        borderRadius: 10,
        padding: '0 20px 15px',
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        '& span': {
            color: '#000000',
            fontFamily: 'Merriweather',
        },
    },
    buttonDark: {
        width: '100%',
        backgroundColor: '#000000',
        '& span': {
            color: '#ffffff',
            fontFamily: 'Lato',
            fontSize: 12,
            letterSpacing: 1.25,
            fontWeight: 'bold',
        },
        height: 40,
        borderRadius: 6.9,
        '&:hover': {
            backgroundColor: '#000000',
        },
    },
    headingWithButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        height: '100%',
        width: 135,
        margin: '10px 0',
    },
    headingWrapper: {
        display: 'flex',
        flexDirection: 'column',
        margin: '10px 0',
        '& .heading': {
            fontWeight: 'bold',
            paddingBottom: '8px',
        },
        '& .see-more': {
            color: 'red',
            textDecoration: 'underline',
            cursor: 'pointer',
        },
    },
    wrapperContent: {
        display: 'flex',
        height: '150px',
    },
    scrollList: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        width: '-webkit-fill-available',
        height: '70%',
        borderRadius: 10,
        padding: '10px 15px',
        overflowY: 'scroll',
        '& .scrollListItem': {
            '& svg': {
                height: 40,
                width: 40,
            },
            paddingBottom: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '& .kidInfo': {
                marginLeft: 10,
                '& .webUrl': {
                    color: 'red',
                },
                '& span': {
                    color: '#000000',
                    fontFamily: 'Lato',
                },
                display: 'flex',
                flexDirection: 'column',
            },
        },
    },
    sixItemList: {
        display: 'flex',
        width: '-webkit-fill-available',
        overflowY: 'auto',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        '& .listItem': {
            marginRight: 30,
            '& svg': {
                height: 40,
                width: 40,
            },
            paddingBottom: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '& .kidInfo': {
                marginLeft: 10,
                width: 200,
                '& .webUrl': {
                    color: 'red',
                },
                '& span': {
                    lineBreak: 'anywhere',
                    color: '#000000',
                    fontFamily: 'Lato',
                },
                display: 'flex',
                flexDirection: 'column',
            },
        },
    },
    singleItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        '& svg': {
            width: 80,
            height: 80,
        },
        '& .kidInfo': {
            marginLeft: 15,
            display: 'flex',
            flexDirection: 'column',
            '& .webUrl': {
                color: 'red',
            },
            '& span': {
                fontSize: 13,
                color: '#000000',
                fontFamily: 'Lato',
            },
        },
    },
    ellipsis: {
        color: '#000000',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
    crisisNote: {
        fontFamily: 'Merriweather',
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#F7274A !important',
        '& span': {
            color: '#F7274A !important',
            fontFamily: 'Lato',
            fontWeight: 400,
        },
    },
});

interface Props {
    event: KidWidgetType;
    level: number;
    showViewButton?: boolean;
}

const KidsListWidget = ({ level, event, showViewButton }: Props) => {
    const classes = useStyles({});

    const viewNotifications = () => {
        history.push('/notifications');
    };

    const getDate = (date?: string) => {
        if (!date) return '';
        const result = format(new Date(date), 'LLL, dd yyyy p');
        return result;
    };

    const totalCrisisUsers = event?.items?.length || 0;

    return (
        <>
            <div
                className={classes.root}
                style={{
                    justifyContent: !event.items || !event.items?.length ? 'center' : 'space-between',
                    alignItems: !event.items || !event.items?.length ? 'center' : 'flex-start',
                }}
            >
                {level === 2 && (
                    <div className={classes.headingWithButton}>
                        <div className={classes.headingWrapper}>
                            <span className="heading">COACHED Engagement</span>
                            <span>
                                {event.items?.length} kid{event.totalItems > 1 ? 's' : ''} limited{' '}
                                <span className="see-more" onClick={viewNotifications}>
                                    {event.totalItems > 6 && <>see all</>}
                                </span>
                            </span>
                        </div>
                        <div className={classes.buttonContainer}>
                            {showViewButton && (
                                <Button className={classes.buttonDark} variant="contained" color="primary" onClick={viewNotifications}>
                                    SEE ALL
                                </Button>
                            )}
                        </div>
                    </div>
                )}
                {level === 3 && (
                    <CrisisEngagementSection>
                        <div className="left-section">
                            <div className="info-section">
                                <h3>CRISIS Engagement</h3>
                                <p>
                                    {totalCrisisUsers} kid{totalCrisisUsers > 1 ? 's' : ''} in crisis{' '}
                                </p>
                            </div>
                            <div className="note-section">PLEASE NOTE: If you haven’t already, you must check-in using the text message we sent.</div>
                        </div>
                        <div className="right-section">
                            {event?.items?.map((res, index) => {
                                const urlToShow = res?.webUrl?.slice(0, 35) || '';
                                return (
                                    <div className="child-record">
                                        <p>
                                            <b>{`${res?.firstName} ${res?.lastName}`}</b>
                                        </p>
                                        <p>
                                            <b>{res?.schoolName || ''}</b>
                                        </p>
                                        <p>
                                            <b>Sent: </b> {getDate(res?.date)}
                                        </p>
                                        <p>
                                            <b>Category: </b> {res?.prrCategory}
                                        </p>
                                        <p>
                                            <b>Site: </b>
                                            <Tooltip title={res?.webUrl || ''}>
                                                <a href={`${res?.webUrl}`} target="_blank" rel="noopener noreferrer">{`${urlToShow}...`}</a>
                                            </Tooltip>
                                        </p>
                                        <p>
                                            <b>Checked-In: </b> {res?.read == 1 ? 'Yes' : 'No'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </CrisisEngagementSection>
                )}
            </div>
        </>
    );
};
export default KidsListWidget;
