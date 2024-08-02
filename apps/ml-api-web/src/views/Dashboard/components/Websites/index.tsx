import React from 'react';
import { useNotificationToast } from '../../../../context/NotificationToastContext/NotificationToastContext';
import { GET_FILTERED_WEBSITES } from '../../../../utils/endpoints';
import { getRequest } from '../../../../utils/api';
import { IFilteredWebsites } from './website.types';
import { logError } from '../../../../utils/helpers';
import Loader from '../../../../components/Loader';
import WebsiteForm from './WebsiteForm';
import { Root, LoadingContainer } from './website.style';

export type Props = {
    refreshWebsites: boolean;
    unSetRefreshWebsites: () => void;
    selectedKidId?: string;
    clearSelectedKidId?: () => void;
};

const Websites = ({ refreshWebsites, unSetRefreshWebsites, selectedKidId, clearSelectedKidId }: Props) => {
    const [filteredURLs, setFilteredURLs] = React.useState<IFilteredWebsites[]>();
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        getFilteredURLs();
    }, []);
    React.useEffect(() => {
        if (refreshWebsites) {
            getFilteredURLs();
            unSetRefreshWebsites();
        }
    }, [refreshWebsites]);
    const { showNotification } = useNotificationToast();
    const getFilteredURLs = React.useCallback(() => {
        setLoading(true);
        getRequest<{}, IFilteredWebsites[]>(GET_FILTERED_WEBSITES, {})
            .then(({ data }) => {
                setFilteredURLs(data);
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
    }, []);
    return (
        <Root>
            <h4>Websites that are always allowed</h4>
            {!loading ? (
                <>
                    <WebsiteForm filteredWebsites={filteredURLs || []} externalSelectedKidId={selectedKidId} clearSelectedKidId={clearSelectedKidId} />
                </>
            ) : (
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
            )}
        </Root>
    );
};

export default Websites;
