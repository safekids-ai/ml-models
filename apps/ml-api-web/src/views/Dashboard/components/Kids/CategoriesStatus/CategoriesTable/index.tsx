import React, { useEffect, useState } from 'react';
import Radio, { RadioProps } from '@mui/material/Radio';
import { makeStyles, withStyles } from '@mui/material/styles';
import { CategoryStatus, IFilteredCategories } from '../categories.types';
import {
    CustomTable,
    CustomTableBody,
    CustomTableCell,
    CustomTableContainer,
    CustomTableHead,
    CustomTableRow,
    TableCellHeading,
    TableTh,
    TitleContainer,
    UpgradeDiviver,
} from './categoriesTable.style';
import { freePlanCategoryCheck } from '../../../../../ConsumerOnboarding/PlanSelector/PlanSelector.utils';
import { getRequest } from '../../../../../../utils/api';
import { GET_USER_PLAN } from '../../../../../../utils/endpoints';
import { ActivePlan } from '../../../../../ConsumerOnboarding/PlanSelector/PlanSelector.type';
import { useNotificationToast } from '../../../../../../context/NotificationToastContext/NotificationToastContext';
import { Button } from '@mui/material';

export type Props = {
    filteredCategoriesData?: IFilteredCategories;
    updateCategoriesData: (id: string, status: CategoryStatus) => void;
};

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const CustomRadio = withStyles({
    root: {
        color: '#4A4A4A',
        '&$checked': {
            color: '#FA6400',
            '&$disabled': {
                color: '#00000042',
            },
        },
    },
    checked: {},
    disabled: {},
})((props?: RadioProps) => <Radio color="default" {...props} />);

export default function CategoriesTable({ filteredCategoriesData, updateCategoriesData }: Props) {
    const { showNotification } = useNotificationToast();
    const [isFreePlan, setPlanType] = useState<boolean>(false);
    const classes = useStyles();
    const composeHeading = (topWords: string, bottomWords: string, boldTopWords: boolean, boldBottomWords: boolean) => {
        return (
            <TableCellHeading>
                <span className={`${boldTopWords && 'bold'}`}>{topWords}</span>
                <span className={`${boldBottomWords && 'bold'}`}>{bottomWords}</span>
            </TableCellHeading>
        );
    };

    const getChecked = (status: string, type: string) => {
        if (status && status === type) return true;
        return false;
    };
    useEffect(() => {
        getRequest<{}, ActivePlan>(GET_USER_PLAN, {})
            .then((res) => {
                if (res.data?.type) {
                    setPlanType(res?.data?.type === 'FREE');
                }
            })
            .catch(() => {
                showNotification({ type: 'error', message: 'Failed to get Plans' });
            });
    }, [filteredCategoriesData, showNotification]);

    const mapFreePlanRows = () => {
        const freePlanCategories = filteredCategoriesData?.categories.filter((category) => freePlanCategoryCheck(category.id));
        return (
            <>
                {freePlanCategories?.map((fCategory) => {
                    return (
                        <CustomTableRow key={fCategory.name}>
                            <CustomTableCell className="name" component="th" scope="row">
                                <TableTh>{fCategory.name}</TableTh>
                            </CustomTableCell>
                            <CustomTableCell align="center">
                                <CustomRadio
                                    checked={getChecked(fCategory?.status, CategoryStatus.ALLOW)}
                                    onClick={() => updateCategoriesData(fCategory?.id, CategoryStatus.ALLOW)}
                                />
                            </CustomTableCell>
                            <CustomTableCell align="center">
                                <CustomRadio
                                    checked={getChecked(fCategory?.status, CategoryStatus.INFORM)}
                                    onClick={() => updateCategoriesData(fCategory?.id, CategoryStatus.INFORM)}
                                />
                            </CustomTableCell>
                            <CustomTableCell align="center">
                                <CustomRadio
                                    checked={getChecked(fCategory?.status, CategoryStatus.ASK)}
                                    onClick={() => updateCategoriesData(fCategory?.id, CategoryStatus.ASK)}
                                />
                            </CustomTableCell>
                            <CustomTableCell align="center">
                                <CustomRadio
                                    checked={getChecked(fCategory?.status, CategoryStatus.PREVENT)}
                                    onClick={() => updateCategoriesData(fCategory?.id, CategoryStatus.PREVENT)}
                                />
                            </CustomTableCell>
                        </CustomTableRow>
                    );
                })}
            </>
        );
    };

    const mapRows = () => {
        const categories = filteredCategoriesData?.categories.filter((category) => !isFreePlan || !freePlanCategoryCheck(category.id));
        return categories?.map((fCategory) => {
            return (
                <CustomTableRow key={fCategory.name}>
                    <CustomTableCell className="name" component="th" scope="row">
                        <TableTh>{fCategory.name}</TableTh>
                    </CustomTableCell>
                    <CustomTableCell align="center">
                        <CustomRadio
                            disabled={isFreePlan}
                            checked={getChecked(fCategory?.status, CategoryStatus.ALLOW)}
                            onClick={() => updateCategoriesData(fCategory?.id, CategoryStatus.ALLOW)}
                        />
                    </CustomTableCell>
                    <CustomTableCell align="center">
                        <CustomRadio
                            disabled={isFreePlan}
                            checked={getChecked(fCategory?.status, CategoryStatus.INFORM)}
                            onClick={() => updateCategoriesData(fCategory?.id, CategoryStatus.INFORM)}
                        />
                    </CustomTableCell>
                    <CustomTableCell align="center">
                        <CustomRadio
                            disabled={isFreePlan}
                            checked={getChecked(fCategory?.status, CategoryStatus.ASK)}
                            onClick={() => updateCategoriesData(fCategory?.id, CategoryStatus.ASK)}
                        />
                    </CustomTableCell>
                    <CustomTableCell align="center">
                        <CustomRadio
                            disabled={isFreePlan}
                            checked={getChecked(fCategory?.status, CategoryStatus.PREVENT)}
                            onClick={() => updateCategoriesData(fCategory?.id, CategoryStatus.PREVENT)}
                        />
                    </CustomTableCell>
                </CustomTableRow>
            );
        });
    };

    return (
        <CustomTableContainer>
            <>
                {isFreePlan && (
                    <>
                        <CustomTableContainer>
                            <CustomTable className={classes.table} aria-label="simple table">
                                <CustomTableHead>
                                    <CustomTableRow>
                                        <CustomTableCell>
                                            <div className='title-container'>
                                                <span className="highlight">FREE Service </span>
                                                <span className="text">with the following Categories</span>{' '}
                                            </div>
                                        </CustomTableCell>
                                        <CustomTableCell align="right">{composeHeading('Always', 'allow', true, false)}</CustomTableCell>
                                        <CustomTableCell align="right">{composeHeading('Allow', 'but inform', false, false)}</CustomTableCell>
                                        <CustomTableCell align="right">{composeHeading('Ask for', 'access', false, false)}</CustomTableCell>
                                        <CustomTableCell align="right">{composeHeading('Never', 'allow', true, false)}</CustomTableCell>
                                    </CustomTableRow>
                                </CustomTableHead>
                                <CustomTableBody>{mapFreePlanRows()}</CustomTableBody>
                            </CustomTable>
                        </CustomTableContainer>

                        <UpgradeDiviver>
                            <TitleContainer>
                                <span className="highlight">Upgrade Service </span>
                                <span className="text">to unlock following Categories</span>
                            </TitleContainer>
                            <div className="hr-container">
                                <hr />
                            </div>

                            <div className="subscribe-container">
                                <a href="#payment">
                                    <Button className="btn" variant="contained" color="primary">
                                        Upgrade
                                    </Button>
                                </a>
                            </div>
                        </UpgradeDiviver>
                    </>
                )}

                <CustomTableContainer>
                    <CustomTable className={classes.table} aria-label="simple table">
                        {!isFreePlan && (
                            <CustomTableHead>
                                <CustomTableRow>
                                    <CustomTableCell></CustomTableCell>
                                    <CustomTableCell align="right">{composeHeading('Always', 'allow', true, false)}</CustomTableCell>
                                    <CustomTableCell align="right">{composeHeading('Allow', 'but inform', false, false)}</CustomTableCell>
                                    <CustomTableCell align="right">{composeHeading('Ask for', 'access', false, false)}</CustomTableCell>
                                    <CustomTableCell align="right">{composeHeading('Never', 'allow', true, false)}</CustomTableCell>
                                </CustomTableRow>
                            </CustomTableHead>
                        )}

                        <CustomTableBody>{mapRows()}</CustomTableBody>
                    </CustomTable>
                </CustomTableContainer>
            </>
        </CustomTableContainer>
    );
}
