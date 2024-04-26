import React, { useState, useEffect, useCallback } from 'react';
import { Typography, makeStyles } from '@mui/material';
import _ from 'lodash';
import CategoriesTable from './CategoriesTable';
import CategoriesHeader from './CategoriesHeader';
import { useMobile } from '../../../../../utils/hooks';
import { getRequest, putRequest } from '../../../../../utils/api';
import { GET_FILTERED_CATEGORIES, PUT_FILTERED_CATEGORIES } from '../../../../../utils/endpoints';
import { logError } from '../../../../../utils/helpers';
import { CategoryStatus, IFilteredCategories, IKid, StyleProps } from './categories.types';
import { Root, LoadingContainer } from './category.style';
import Loader from '../../../../../components/Loader';
import { useNotificationToast } from '../../../../../context/NotificationToastContext/NotificationToastContext';

export type Props = {
    refreshCategories: boolean;
    unSetRefreshCategories: () => void;
};

const useStyles = makeStyles({
    title: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: ({ isMobile = false }: StyleProps) => (isMobile ? '80px' : 'unset'),
        fontSize: '15px',
        lineHeight: '18px',
        letterSpacing: '-0.25px',
    },
});

const defaultKid = {
    id: '',
    name: '',
};

const CategoriesStatus = ({ refreshCategories, unSetRefreshCategories }: Props) => {
    const [originalFilteredCategories, setOriginalFilteredCategories] = useState<IFilteredCategories[]>();
    const [filteredCategories, setFilteredCategories] = useState<IFilteredCategories[]>();
    const [kidsData, setKidsData] = useState<IKid[]>();
    const [selectedKidData, setSelectedKidData] = useState<IKid>(defaultKid);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const { showNotification } = useNotificationToast();
    const getFilteredCategories = useCallback(() => {
        setLoading(true);
        getRequest<{}, IFilteredCategories[]>(GET_FILTERED_CATEGORIES, {})
            .then(({ data }) => {
                setOriginalFilteredCategories(data);
                setFilteredCategories(data);
                setKidsData(
                    data?.map((kData: IFilteredCategories) => {
                        return { id: kData.id, name: kData.name };
                    })
                );
                setSelectedKidData(data?.length > 0 ? data[0] : defaultKid);
            })
            .catch((err) => {
                logError('Error:', err);
                showNotification({
                    type: 'error',
                    message: 'Unable to fetch categories status',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [showNotification]);
    useEffect(() => {
        getFilteredCategories();
    }, [getFilteredCategories]);
    useEffect(() => {
        if (refreshCategories) {
            getFilteredCategories();
            unSetRefreshCategories();
        }
    }, [getFilteredCategories, refreshCategories, unSetRefreshCategories]);
    const setSelectedKid = (selectedId: string) => {
        const data = kidsData?.find((kData) => selectedId === kData.id);
        setSelectedKidData(data || defaultKid);
    };
    const updateCategoriesData = (id: string, status: CategoryStatus) => {
        if (!filteredCategories) return;
        const data: IFilteredCategories[] = filteredCategories.map((kidData) => {
            if (kidData.id === selectedKidData.id) {
                const tempCategories = kidData?.categories?.map((category) => {
                    if (category.id === id) {
                        return {
                            id: category.id,
                            name: category.name,
                            enabled: category.enabled,
                            status: status,
                        };
                    } else return category;
                });
                return {
                    id: kidData?.id,
                    name: kidData?.name,
                    categories: tempCategories,
                };
            }
            return kidData;
        });
        setFilteredCategories(data);
    };
    const saveFilteredCategoriesData = () => {
        if (btnLoading || filteredCategories?.length === 0) return;
        setBtnLoading(true);
        const putData = filteredCategories || [];
        putRequest<{}, IFilteredCategories[]>(PUT_FILTERED_CATEGORIES, putData)
            .then((response) => {
                setOriginalFilteredCategories(filteredCategories);
                showNotification({
                    type: 'success',
                    message: 'Categories status updated successfully',
                });
            })
            .catch((err: any) => {
                console.log(err);
                showNotification({
                    type: 'error',
                    message: 'Unable to updated categories status',
                });
            })
            .finally(() => {
                setBtnLoading(false);
            });
    };
    const filteredCategoriesSelectedKid = filteredCategories?.find((fCategory) => fCategory.id === selectedKidData.id);
    const isMobile = useMobile();
    const classes = useStyles({ isMobile });
    const enableSaveBtn = _.isEqual(filteredCategories, originalFilteredCategories);
    return (
        <Root>
            <Typography className={classes.title} variant="h4">
                Categories{' '}
            </Typography>
            {!loading ? (
                <>
                    <CategoriesHeader
                        kidsData={kidsData || []}
                        selectedKid={selectedKidData}
                        setSelectedKid={setSelectedKid}
                        enableSave={enableSaveBtn}
                        saveData={saveFilteredCategoriesData}
                        btnLoading={btnLoading}
                    />
                    <CategoriesTable filteredCategoriesData={filteredCategoriesSelectedKid} updateCategoriesData={updateCategoriesData} />
                </>
            ) : (
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            )}
        </Root>
    );
};

export default CategoriesStatus;
