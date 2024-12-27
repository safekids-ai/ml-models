import React from 'react';
import { Form, Formik } from 'formik';
import { MenuItem } from '@mui/material';
import { validateWebsite } from '../../../../../utils/validations';
import { SelectDropdown, SubmitButton } from '../../../../../components/InputFields';
import { useNotificationToast } from '../../../../../context/NotificationToastContext/NotificationToastContext';
import { POST_FILTERED_WEBSITES, DELETE_FILTERED_WEBSITES } from '../../../../../utils/endpoints';
import { postRequest, deleteRequest } from '../../../../../utils/api';
import { addUrls, removeUrlItem } from './websiteForms.utility';
import {
    Root,
    HeaderSection,
    BodySection,
    FooterSection,
    SelectSection,
    FieldWrapper,
    AddWebsitesContainer,
    AddedUrl,
    CustomLoaderDelete,
    CustomChip,
} from './websiteForm.style';
import { IFilteredWebsites, IUrls } from '../website.types';

interface Props {
    filteredWebsites: IFilteredWebsites[];
    externalSelectedKidId?: string;
    clearSelectedKidId?: () => void;
}

const WebsiteForm = ({ filteredWebsites, externalSelectedKidId, clearSelectedKidId }: Props) => {
    const [websites, setWebsites] = React.useState([...filteredWebsites]);
    const [selectedKidId, setSelectedKidId] = React.useState(filteredWebsites[0]?.id);
    const [urlInput, setUrlInput] = React.useState<string>('');
    const [btnLoading, setBtnLoading] = React.useState(false);
    const [selectedUrlIdToDelete, setSelectedUrlToDelete] = React.useState('');
    const [removeUrlLoading, setRemoveUrlLoading] = React.useState(false);

    React.useEffect(() => {
        setWebsites(filteredWebsites);
    }, [filteredWebsites]);

    React.useEffect(() => {
        if (externalSelectedKidId) {
            setSelectedKidId(externalSelectedKidId || filteredWebsites[0]?.id);
            clearSelectedKidId && clearSelectedKidId();
        }
    }, [externalSelectedKidId]);

    const { showNotification } = useNotificationToast();

    const saveData = async () => {
        setBtnLoading(true);
        const selectedKidWebsites = addUrls(urlInput, selectedKidId, websites);
        setUrlInput('');
        if (!selectedKidWebsites || selectedKidWebsites.urlsToAdd.length === 0) {
            /**
             * Here it will check weather the valid URLs filtered length is equal to zero means no valid URL is present.
             * It wont send API call here to server but only populate the nonfiltered URLs in local websites copy.
             */
            const finalWebsiteslocal: IFilteredWebsites[] = websites.reduce((finalWebsites: IFilteredWebsites[], currentKidData: IFilteredWebsites) => {
                if (currentKidData.id === selectedKidWebsites.id) {
                    finalWebsites.push({
                        id: currentKidData.id,
                        name: currentKidData.name || '',
                        urls: selectedKidWebsites.nonFilteredUrls || [],
                    });
                } else {
                    finalWebsites.push(currentKidData);
                }
                return finalWebsites;
            }, []);
            setWebsites(finalWebsiteslocal);
            setBtnLoading(false);
            return;
        }
        postRequest<{}, IFilteredWebsites>(POST_FILTERED_WEBSITES, {
            id: selectedKidWebsites.id,
            name: selectedKidWebsites.name,
            urls: selectedKidWebsites.urlsToAdd,
        })
            .then((response) => {
                const responseUrls = [...response.data.urls];
                const finalWebsiteslocal: IFilteredWebsites[] = websites.reduce((finalWebsites: IFilteredWebsites[], currentKidData: IFilteredWebsites) => {
                    if (currentKidData.id === selectedKidWebsites.id) {
                        const finalUrls = selectedKidWebsites.nonFilteredUrls.map((url: IUrls) => {
                            const newUrl = responseUrls.find((nUrl) => nUrl.name === url.name);
                            if (newUrl) {
                                const finalNewUrl = { ...url };
                                finalNewUrl['id'] = newUrl.id;
                                if (newUrl.hasOwnProperty('isInvalid')) finalNewUrl['isInvalid'] = newUrl.isInvalid;
                                return finalNewUrl;
                            } else return url;
                        });
                        finalWebsites.push({
                            id: currentKidData.id,
                            name: currentKidData.name || '',
                            urls: finalUrls || [],
                        });
                    } else {
                        finalWebsites.push(currentKidData);
                    }
                    return finalWebsites;
                }, []);
                setWebsites(finalWebsiteslocal);
                showNotification({
                    type: 'success',
                    message: 'Websites updated successfully',
                });
            })
            .catch((err: any) => {
                console.log(err);
                showNotification({
                    type: 'error',
                    message: 'Unable to updated websites',
                });
            })
            .finally(() => {
                setBtnLoading(false);
            });
    };

    const removeUrl = (selectedUrl: IUrls) => {
        if (selectedUrlIdToDelete || btnLoading) return;
        setRemoveUrlLoading(true);
        setSelectedUrlToDelete(selectedUrl.id || '');
        if (selectedUrl.hasOwnProperty('id')) {
            deleteRequest<{}, IFilteredWebsites>(`${DELETE_FILTERED_WEBSITES}/${selectedUrl.id}`, {})
                .then((response) => {
                    showNotification({
                        type: 'success',
                        message: `Website ${selectedUrl.name} deleted successfully`,
                    });
                    setWebsites(removeUrlItem(selectedKidId, selectedUrl.name, websites));
                })
                .catch((err: any) => {
                    console.log(err);
                    showNotification({
                        type: 'error',
                        message: `Unable to remove websites  ${selectedUrl.name}`,
                    });
                })
                .finally(() => {
                    setRemoveUrlLoading(false);
                    setSelectedUrlToDelete('');
                });
        } else {
            setWebsites(removeUrlItem(selectedKidId, selectedUrl.name, websites));
            setRemoveUrlLoading(false);
            setSelectedUrlToDelete('');
            showNotification({
                type: 'success',
                message: `Website ${selectedUrl.name} deleted successfully`,
            });
        }
    };

    return (
        <Root>
            <Formik
                initialValues={{
                    KidsData: websites,
                    selectedKidData: selectedKidId || '',
                }}
                enableReinitialize
                onSubmit={(values: { KidsData: IFilteredWebsites[] }) => {
                    saveData();
                }}>
                {({ values, isSubmitting, setFieldValue }) => {
                    const { KidsData } = values;
                    const getSelectedKidURLs = () => KidsData.find((data) => data.id === selectedKidId);
                    return (
                        <Form onSubmit={() => {}}>
                            <HeaderSection>
                                <SelectSection>
                                    <span className="select-label">Choose a family member:</span>
                                    <FieldWrapper>
                                        <SelectDropdown
                                            name="selectedKidData"
                                            label={null}
                                            variant={'standard'}
                                            className="select-field"
                                            multiple={false}
                                            value={KidsData.some(kData => kData.id === selectedKidId) ? selectedKidId : ''}
                                          //value={selectedKidId}
                                            onChange={(e: any) => setSelectedKidId(e.target.value)}
                                            SelectProps={{ displayEmpty: true }}>
                                            {KidsData.map((kData) => (
                                                <MenuItem key={kData.id} value={kData.id}>
                                                    {kData.name}
                                                </MenuItem>
                                            ))}
                                        </SelectDropdown>
                                    </FieldWrapper>
                                </SelectSection>
                            </HeaderSection>

                            <>
                                <BodySection>
                                    <div className="body-heading">Always Allowed</div>
                                    <ul className="website-container">
                                        {getSelectedKidURLs()?.urls.map((fUrl, index) => {
                                            return (
                                                <li className="website-row" key={index.toString()}>
                                                    <div className="website-url">
                                                        {fUrl.hasOwnProperty('isInvalid') ? (
                                                            <>
                                                                <CustomChip isInvalid={fUrl?.isInvalid}>{fUrl?.isInvalid ? 'Invalid' : 'Valid'}</CustomChip>
                                                                <AddedUrl invalid={!!fUrl?.isInvalid || false}>
                                                                    <a
                                                                        target="_blank"
                                                                        href={fUrl.name.search('http') !== -1 ? fUrl.name : `https://${fUrl.name}`}>
                                                                        {fUrl.name}
                                                                    </a>
                                                                </AddedUrl>
                                                            </>
                                                        ) : (
                                                            <a target="_blank" href={`https://${fUrl.name}`}>
                                                                {fUrl.name}
                                                            </a>
                                                        )}
                                                    </div>

                                                    <CustomLoaderDelete
                                                        loading={selectedUrlIdToDelete === fUrl.id && removeUrlLoading}
                                                        data-testid="test-remove-btn"
                                                        id="test-remove-btn"
                                                        onClick={() => {
                                                            removeUrl(fUrl);
                                                        }}>
                                                        x
                                                    </CustomLoaderDelete>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </BodySection>
                                <FooterSection>
                                    <AddWebsitesContainer>
                                        <span>To add more websites to this list, copy and paste them here</span>
                                        <input
                                            placeholder="Enter website(s) here"
                                            value={urlInput}
                                            name="add-websites-input"
                                            onChange={(evt) => {
                                                setUrlInput(evt.target.value);
                                            }}
                                        />
                                        <SubmitButton
                                            isSubmitting={btnLoading}
                                            marginTop={0}
                                            text="ADD SITES"
                                            disabled={!urlInput}
                                            marginBottom={20}
                                            onClick={(e: React.MouseEvent<HTMLElement>) => {
                                                e.preventDefault();
                                                saveData();
                                            }}
                                            id="test-Add-btn"
                                            data-testid="test-Add-btn"
                                        />
                                    </AddWebsitesContainer>
                                    <p className="message-for-parent">
                                        NOTE: Only add websites you know will be <span className="bold">safe</span>
                                    </p>
                                </FooterSection>
                            </>
                        </Form>
                    );
                }}
            </Formik>
        </Root>
    );
};

export default WebsiteForm;
