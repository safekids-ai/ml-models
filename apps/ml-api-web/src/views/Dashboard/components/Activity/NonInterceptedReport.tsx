import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles, Paper, Switch, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Box } from '@material-ui/core';
import { getRequest, postRequest } from '../../../../utils/api';
import { GET_NON_INTERCEPT_REPORT, POST_FILTERED_URL_DISABLE } from '../../../../utils/endpoints';
import { logError } from '../../../../utils/helpers';
import Loader from '../../../../components/Loader';
import { NonInterceptDataType } from './SchoolActivity.type';
import styled from 'styled-components';
import { SubmitButton } from '../../../../components/InputFields';

const useStyles = makeStyles({
    root: {
        width: '100%',
        margin: '20px 20px 20px 0',
        height: '95%',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: '25px 0px 25px 30px',
        '& span': {
            color: 'black',
            fontFamily: 'Merriweather',
            fontWeight: 'bold',
            fontSize: 13,
        },
        '& .small-span': {
            color: 'black',
            fontFamily: 'Merriweather',
            fontSize: 13,
            fontWeight: 'normal',
        },
    },
    instancesContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: '20px',
        '& .count': {
            fontSize: 35,
            fontFamily: 'Lato',
        },
    },
    nonIntercept: {
        margin: '20px 10px 20px 0px',
        '& thead': {
            textAlign: 'left',
        },
        '& table': {
            fontFamily: 'Merriweather',
            fontSize: '18px',
            borderCollapse: 'collapse',
            '& td': {
                width: '45%',
                padding: '10px',
            },
            '& tr': {
                borderBottom: '1px solid #000000',
            },
        },
    },
    loader: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'calc(50vh - 190px)',
    },
    tableContainer: {
        boxShadow: '0 0 0 0 white',
        '& .number-cell': {
            color: 'red',
            fontWeight: 'bold',
        },
        '& .switch-intercept': {
            '& .MuiSwitch-root': {
                margin: '0 30px',
            },
            '& .thead': {
                fontWeight: 'bold',
            },
        },
    },
});

interface Props {
    startDate: Date;
    endDate: Date;
}
const MoreButton = styled.div`
    margin-top: 50px;
    margin-left: 33%;
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
const NonInterceptedReport = ({ startDate, endDate }: Props) => {
    const classes = useStyles({});
    const [nonInterceptedData, setNonInterceptedData] = useState<NonInterceptDataType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [order, setOrder] = React.useState('desc');
    const [totalPage, setTotalPage] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(0);

    const pageSize = 50;

    const getNonInterceptData = useCallback(async (page: number, size: number, order: string) => {
        try {
            setLoading(true);
            const result = await getRequest<{}, any>(GET_NON_INTERCEPT_REPORT, {
                start: startDate,
                end: endDate,
                orderBy: order,
                page: page,
                size: size,
            });
            setCurrentPage(result.data.currentPage);
            setTotalPage(result.data.totalPages);

            setLoading(false);
            return result.data.items;
        } catch (error) {
            logError('Get Non Intercept Data', error);
            setLoading(false);
        }
    }, [endDate, startDate]);

    useEffect(() => {
        getNonInterceptData(currentPage, pageSize, order).then((result) => {
            setNonInterceptedData(result);
        });
    }, [startDate, endDate, getNonInterceptData, currentPage, order]);

    const getMoreNonInterceptedData = async () => {
        setIsSubmitting(true);
        const result = await getNonInterceptData(currentPage + 1, pageSize, order);
        setNonInterceptedData([...nonInterceptedData, ...result]);
        setIsSubmitting(false);
    };

    const handleRequestSort = async () => {
        const value = order === 'asc' ? 'desc' : 'asc';
        setOrder(value);
        const result = await getNonInterceptData(0, pageSize, value);
        setNonInterceptedData(result);
    };

    const disableFilteredUrl = async (url: string, enable: boolean) => {
        try {
            await postRequest<{}, any>(POST_FILTERED_URL_DISABLE, {
                url: url,
                enabled: !enable, //disable url
            });
        } catch (error) {
            logError('enable Filtered Url patch failed', error);
        }
    };

    const setInterceptToggle = async (webUrl: string, value: boolean) => {
        await disableFilteredUrl(webUrl, value);
        const newNonInterceptedData = nonInterceptedData?.map((data: NonInterceptDataType) =>
            data.webUrl === webUrl ? { ...data, isIntercept: value } : data,
        );
        setNonInterceptedData(newNonInterceptedData);
    };

    return (
        <>
            {nonInterceptedData && nonInterceptedData.length > 0 && (
                <div
                    className={classes.root}
                    style={{
                        border: `2px solid #000000`,
                    }}
                >
                    <div className={classes.instancesContainer}>
                        <span>Frequent sites visited, their category, and intercept status in the chosen period, during school hours.</span>
                    </div>
                    {loading ? (
                        <div className={classes.loader}>
                            <Loader height="50px" width="50px" pathColor="rgba(247, 39, 74, 0.4)" loaderColor={'rgba(247, 39, 74, 1)'} />
                        </div>
                    ) : (
                        <div className={classes.nonIntercept}>
                            {nonInterceptedData && nonInterceptedData.length > 0 ? (
                                <>
                                    <TableContainer component={Paper} className={classes.tableContainer}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="thead">Url</TableCell>
                                                    <TableCell className="thead" align="center">
                                                        Category
                                                    </TableCell>
                                                    <TableCell className="thead number-cell" align="center">
                                                        Number
                                                        <TableSortLabel active={true} direction={order === 'asc' ? 'asc' : 'desc'} onClick={handleRequestSort}>
                                                            <Box component="span"></Box>
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell className="thead" align="center">
                                                        Intercepted
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {nonInterceptedData &&
                                                    nonInterceptedData.map((row: NonInterceptDataType) => (
                                                        <TableRow key={row.id}>
                                                            <TableCell component="th" scope="row">
                                                                {row.webUrl}
                                                            </TableCell>
                                                            <TableCell align="center">{row.category}</TableCell>
                                                            <TableCell align="center">{row.count}</TableCell>
                                                            <TableCell align="center" className="switch-intercept">
                                                                <Switch
                                                                    checked={row.isIntercept}
                                                                    disabled={row.isIntercept}
                                                                    title={row.isIntercept ? 'intercepted' : 'Not Intercepted'}
                                                                    onChange={(evt) => setInterceptToggle(row.webUrl, evt.target.checked)}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    {totalPage > currentPage + 1 && (
                                        <MoreButton onClick={() => getMoreNonInterceptedData()}>
                                            <SubmitButton isSubmitting={isSubmitting} text="More" />
                                        </MoreButton>
                                    )}
                                </>
                            ) : (
                                <span> No Intercept Exist For Category!</span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
export default NonInterceptedReport;
