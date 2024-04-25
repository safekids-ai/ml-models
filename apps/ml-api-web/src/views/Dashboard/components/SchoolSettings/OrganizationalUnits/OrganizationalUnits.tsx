import React, { useEffect, useState } from 'react';
import { SubmitButton } from '../../../../../components/InputFields';
import Loader from '../../../../../components/Loader';
import OUITree from '../../../../../components/OUITree/OUITree';
import { useNotificationToast } from '../../../../../context/NotificationToastContext/NotificationToastContext';
import { getRequest, postRequest } from '../../../../../utils/api';
import { GET_JOB_STATUS, GET_ONBOARDING_ORGUNITS, UPDATE_JOB_STATUS } from '../../../../../utils/endpoints';
import { logError } from '../../../../../utils/helpers';
import { JobStatus, JobTypes } from '../SchoolSettings.types';
import { Description, LoaderContainer, OUContainer, Root, SyncButton, Title } from './OrganizationalUnits.style';

const OrganizationalUnits = () => {
    const [ouTree, setOuTree] = useState<any[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showNotification } = useNotificationToast();

    useEffect(() => {
        getOUs();
    }, []);

    const getOUs = () => {
        getRequest<{}, any[]>(GET_ONBOARDING_ORGUNITS, {})
            .then((response) => {
                if (response.data) {
                    setOuTree(response.data);
                }
            })
            .catch((err) => {
                setOuTree([]);
                logError('GET ONBOARDING ORG UNITS', err);
            });
    };

    const sync = () => {
        setIsLoading(true);
        postRequest<{}, any>(UPDATE_JOB_STATUS, {
            status: JobStatus.STARTED,
            type: JobTypes.OU,
        })
            .then((res) => {
                const polling = setInterval(() => {
                    getRequest<{}, any>(GET_JOB_STATUS.replace('{jobId}', res.data.id), {})
                        .then((response) => {
                            if (response.data.status === JobStatus.FAILED) {
                                showNotification({
                                    type: 'error',
                                    message: response.data.remarks,
                                });
                                setIsLoading(false);
                                clearInterval(polling);
                            } else if (response.data.status === JobStatus.COMPLETED) {
                                showNotification({
                                    type: 'success',
                                    message: response.data.remarks,
                                });
                                setIsLoading(false);
                                clearInterval(polling);
                                getOUs();
                            }
                        })
                        .catch((err) => {
                            clearInterval(polling);
                            showNotification({ type: 'error', message: 'Synchorinzation Failed.' });
                            logError('GET JOB STATUS', err);
                        });
                }, 3000);
            })
            .catch((err) => {
                setIsLoading(false);
                showNotification({ type: 'error', message: 'Synchorinzation Failed.' });
                logError('UPDATE JOB STATUS', err);
            });
    };

    return (
        <>
            <Root>
                <Title>Organizational Units</Title>
                <Description>Synchronize organizatinal units</Description>
                <OUContainer>
                    <span>Organizational Units</span>
                    {ouTree ? (
                        <OUITree data={ouTree} />
                    ) : (
                        <LoaderContainer>
                            <span>Please wait a moment...</span>
                            <Loader height="100px" width="100px" pathColor="rgba(247, 39, 74, 0.4)" loaderColor={'rgba(247, 39, 74, 1)'} />
                        </LoaderContainer>
                    )}
                </OUContainer>
                <SyncButton>
                    <SubmitButton isSubmitting={isLoading} disabled={isLoading} text="Sync" onClick={() => sync()} />
                </SyncButton>
            </Root>
        </>
    );
};

export default OrganizationalUnits;
