import { Button } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { SubmitButton } from '../../../components/InputFields';
import { getRequest, postRequest } from '../../../utils/api';
import { GET_ONBOARDING_URLS, POST_ONBOARDING_URLS } from '../../../utils/endpoints';
import { logError } from '../../../utils/helpers';
import { validateWebsite } from '../../../utils/validations';
import ApplyToAllDialog from '../ApplyToAllDialog/ApplyToAllDialog';
import FeatureDescriptionDialog from '../FeatureDescriptionDialog/FeatureDescriptionDialog';
import UrlTable from './UrlTable/UrlTable';
import { Props } from './Websites.types';
import { useNotificationToast } from '../../../context/NotificationToastContext/NotificationToastContext';
import { Root, Description, ContinueButton, SaveButton, Title, AddWebsitesContainer } from './Websites.style';

const Websites = ({ ouTree, nextStep, isSettings }: Props) => {
    const [selectedOU, setSelectedOU] = useState<any>();
    const [ouData, setOUData] = useState<object[]>([]);
    const [urlInput, setUrlInput] = useState<string>('');
    const [enableApplyToAll, setEnableApplyToAll] = useState<boolean>(false);
    const [showApplyToAllWarning, setShowApplyToAllWarning] = useState<boolean>(false);
    const [urlsToUpdate, setUrlsToUpdate] = useState<string[]>([]);
    const [idsToUpdate, setIdsToUpdate] = useState<string[]>([]);
    const [showFeatureDescription, setShowFeatureDescription] = useState<boolean>(false);
    const [featureDescription, setFeatureDescription] = useState<string>('');
    const { showNotification } = useNotificationToast();
    const [tabValue, setTabValue] = useState<string>('1');

    const accountType: string | null = localStorage.getItem('account_type');

    const initaliseTree = useCallback((nodes: any, newUrls: any[], idList: string[], parentUrls: string[], isUrlsUpdated?: boolean) => {
        for (let i = 0; i < nodes.length; i++) {
            if (!isUrlsUpdated) {
                nodes[i]['urls'] = newUrls;
            }
            if (!nodes[i]['urls']?.length) {
                nodes[i]['urls'] = parentUrls;
            }
            nodes[i]['urls'].sort((a: any, b: any) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
            nodes[i]['parentUrls'] = parentUrls.sort((a: any, b: any) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
            nodes[i]['inherit'] = JSON.stringify(nodes[i]['urls']) === JSON.stringify(nodes[i]['parentUrls']);
            if (!nodes[i]['inherit']) {
                setEnableApplyToAll(true);
            }
            idList.push(nodes[i].id);
            if ('children' in nodes[i] && nodes[i].children.length) {
                initaliseTree(nodes[i].children, newUrls, idList, nodes[i]['urls'], isUrlsUpdated);
            }
        }
        return;
    }, []);

    useEffect(() => {
        if (ouTree.length) {
            getRequest<{}, any[]>(GET_ONBOARDING_URLS, {})
                .then((response) => {
                    if (response.data) {
                        const ids: string[] = [];
                        initaliseTree(ouTree, response.data, ids, ouTree[0]['urls']?.length ? ouTree[0]['urls'] : response.data, true);
                        if (!isSettings) {
                            setUrlsToUpdate(response.data);
                            setIdsToUpdate(ids);
                        }
                        setOUData(ouTree);
                    }
                })
                .catch((err) => {
                    logError('GET ONBOARDING URLS', err);
                });
        }
    }, [initaliseTree, isSettings, ouTree]);

    const selectOUHandler = (node: any) => {
        updateUrls();
        setIdsToUpdate([]);
        setUrlsToUpdate([]);
        setSelectedOU(node);
    };

    const addUrls = () => {
        let seperatedUrls: any = urlInput.split(',');
        seperatedUrls = seperatedUrls.map((url: string) => {
            if (selectedOU.urls.some((_url: any) => _url.name === url.trim())) {
                selectedOU.urls.splice(
                    selectedOU.urls.findIndex((_url: any) => _url.name === url.trim()),
                    1,
                );
            }
            return {
                name: url.trim(),
                enabled: tabValue === '1',
                isInvalid: !!validateWebsite(url.trim()),
            };
        });
        const newUrls = [...seperatedUrls, ...selectedOU.urls]
            .filter((url: any) => url && url.hasOwnProperty('isInvalid') && url.isInvalid)
            .concat([...seperatedUrls, ...selectedOU.urls].filter((url: any) => url && url.hasOwnProperty('isInvalid') && !url.isInvalid))
            .concat(selectedOU.urls.filter((url: any) => url && !url.hasOwnProperty('isInvalid')));
        const ids: string[] = [];
        setUrlsToUpdate(newUrls);
        editTree(ouData, newUrls, ids);
        setIdsToUpdate(ids);
        setSelectedOU({ ...selectedOU, urls: newUrls });
        setUrlInput('');
    };

    const removeUrls = (urlNames: string[]) => {
        const newUrls = [...selectedOU.urls].filter((url) => !urlNames.includes(url.name));
        const ids: string[] = [];
        setUrlsToUpdate(newUrls);
        editTree(ouData, newUrls, ids);
        setIdsToUpdate(ids);
        setSelectedOU({ ...selectedOU, urls: newUrls });
    };

    const editTree = (nodes: any[], newUrls: any[], idList: string[], nodeIdToReturn?: string, changeUrls?: boolean, inheritFromParent?: boolean) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodeIdToReturn === nodes[i].id) {
                nodes[i].parentUrls = newUrls;
                return;
            }
            if (nodes[i].id === selectedOU.id) {
                if (nodes[i + 1]?.id) {
                    nodeIdToReturn = nodes[i + 1].id;
                }
                if (inheritFromParent) {
                    nodes[i].inherit = true;
                }
                changeUrls = true;
            }
            if (changeUrls) {
                if (selectedOU.id !== nodes[i].id) {
                    nodes[i].parentUrls = newUrls;
                }
                if (nodes[i].inherit || selectedOU.id === nodes[i].id) {
                    if (selectedOU.parentOuId !== null && selectedOU.id === nodes[i].id) {
                        setEnableApplyToAll(JSON.stringify(nodes[i].parentUrls) !== JSON.stringify(newUrls));
                    }
                    nodes[i].urls = newUrls;
                    idList.push(nodes[i].id);
                }
            }
            if ('children' in nodes[i] && nodes[i].children.length && !(selectedOU.id !== nodes[i].id && !nodes[i].inherit && changeUrls)) {
                editTree(nodes[i].children, newUrls, idList, nodeIdToReturn, changeUrls, inheritFromParent);
            }
        }
        return;
    };

    const untickInherit = (nodes: any) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === selectedOU.id) {
                nodes[i].inherit = false;
                return;
            }
            if ('children' in nodes[i] && nodes[i].children.length) {
                untickInherit(nodes[i].children);
            }
        }
    };

    const toggleInherit = (value: boolean) => {
        if (value) {
            const ids: string[] = [];
            setUrlsToUpdate(selectedOU.parentUrls);
            editTree(ouData, selectedOU.parentUrls, ids, undefined, undefined, true);
            setIdsToUpdate(ids);
            setSelectedOU({
                ...selectedOU,
                urls: selectedOU.parentUrls,
                inherit: value,
            });
        } else {
            untickInherit(ouTree);
            setSelectedOU({ ...selectedOU, inherit: value });
        }
    };

    const applyToAll = () => {
        setShowApplyToAllWarning(true);
    };

    const onCloseApplyToAll = () => {
        const ids: string[] = [];
        initaliseTree(ouTree, ouTree[0].urls, ids, ouTree[0].urls);
        setUrlsToUpdate(ouTree[0].urls);
        setIdsToUpdate(ids);
        setEnableApplyToAll(false);
        setShowApplyToAllWarning(false);
    };

    const updateUrls = () => {
        if (idsToUpdate.length) {
            postRequest<{}, any[]>(POST_ONBOARDING_URLS, {
                orgUnitIds: idsToUpdate,
                urls: urlsToUpdate.filter((url: any) => !url.isInvalid).map((url: any) => ({ name: url.name, enabled: url.enabled })),
            })
                .then(() => {
                    if (isSettings) {
                        showNotification({
                            type: 'success',
                            message: 'URLs updated successfully.',
                        });
                    }
                })
                .catch((err) => {
                    showNotification({
                        type: 'error',
                        message: 'Failed to updated URLs.',
                    });
                    logError('POST ONBOARDING URLS', err);
                });
        }
    };

    const onContinue = () => {
        updateUrls();
        nextStep?.();
    };

    const showFeatureDescriptionDialog = (description: string) => {
        setFeatureDescription(description);
        setShowFeatureDescription(true);
    };

    return (
        <>
            <Root>
                <Title isSettings={isSettings}>Websites</Title>
                <Description>First choose a level. For each level, you may modify the list of websites.</Description>
                <UrlTable
                    showFeatureDescription={showFeatureDescriptionDialog}
                    enableApplyToAll={enableApplyToAll}
                    toggleInherit={toggleInherit}
                    applyToAll={() => applyToAll()}
                    isRootNode={selectedOU ? selectedOU.parentOuId === null : true}
                    inherit={selectedOU?.inherit}
                    ouData={ouData}
                    urls={selectedOU ? selectedOU.urls : []}
                    removeUrls={removeUrls}
                    setOU={selectOUHandler}
                    isSettings={isSettings}
                    tabValue={tabValue}
                    handleTabChange={(e, value) => setTabValue(value.toString())}
                    accountType={accountType}
                />
                <AddWebsitesContainer>
                    <span>
                        {tabValue === '1'
                            ? 'To add more websites to this list, copy and paste them here:'
                            : 'To intercept specific websites, add them here. Copy and paste them into the field to the right:'}
                    </span>
                    <input placeholder="Paste website(s) here" value={urlInput} onChange={(evt) => setUrlInput(evt.target.value)} />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!selectedOU?.id || !urlInput || (selectedOU?.parentOuId !== null && selectedOU?.inherit)}
                        onClick={() => addUrls()}
                    >
                        ADD SITES
                    </Button>
                </AddWebsitesContainer>
                {isSettings ? (
                    <SaveButton>
                        <SubmitButton text="Save" onClick={() => onContinue()} />
                    </SaveButton>
                ) : (
                    <ContinueButton>
                        <SubmitButton text="Continue" onClick={() => onContinue()} />
                    </ContinueButton>
                )}
            </Root>
            {showApplyToAllWarning && <ApplyToAllDialog onApply={() => onCloseApplyToAll()} onClose={() => setShowApplyToAllWarning(false)} />}
            {showFeatureDescription && <FeatureDescriptionDialog description={featureDescription} onClose={() => setShowFeatureDescription(false)} />}
        </>
    );
};

export default Websites;
