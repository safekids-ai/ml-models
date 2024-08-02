import React from 'react';
import { useNotificationToast } from '../../../../context/NotificationToastContext/NotificationToastContext';
import { GET_FILTERED_PROCESS } from '../../../../utils/endpoints';
import { getRequest } from '../../../../utils/api';
import { logError } from '../../../../utils/helpers';
import Loader from '../../../../components/Loader';
import ProcessForm from './ProcessesForm/ProcessesForm';
import { Root, LoadingContainer } from './Processes.style';
import { IFilteredProcesses } from './Processes.types';

export type Props = {
    refreshProcesses: boolean;
    unSetRefreshProcesses: () => void;
    selectedKidId?: string;
    clearSelectedKidId?: () => void;
};

const Processes = ({ refreshProcesses, unSetRefreshProcesses, selectedKidId, clearSelectedKidId }: Props) => {
    const [filteredProcesses, setFilteredProcesses] = React.useState<IFilteredProcesses[]>();
    const [loading, setLoading] = React.useState(false);
    const { showNotification } = useNotificationToast();

    React.useEffect(() => {
        getFilteredProcesses();
    }, []);
    React.useEffect(() => {
        if (refreshProcesses) {
            getFilteredProcesses();
            unSetRefreshProcesses();
        }
    }, [refreshProcesses]);

    const getFilteredProcesses = React.useCallback(() => {
        setLoading(true);
        getRequest<{}, IFilteredProcesses[]>(GET_FILTERED_PROCESS, {})
            .then(({ data }) => {
                setFilteredProcesses(data);
            })
            .catch((err) => {
                logError('Error:', err);
                showNotification({
                    type: 'error',
                    message: 'Unable to fetch filtered processes',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <Root>
            <h4>Windows Process Bypass:</h4>
            {loading ? (
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            ) : (
                <ProcessForm filteredProcesses={filteredProcesses || []} externalSelectedKidId={selectedKidId} clearSelectedKidId={clearSelectedKidId} />
            )}
        </Root>
    );
};

export default Processes;
