import React from 'react';
import { Form, Formik } from 'formik';
import { MenuItem } from '@mui/material';
import { validateProcessName } from '../../../../../utils/validations';
import { SelectDropdown, SubmitButton } from '../../../../../components/InputFields';
import { useNotificationToast } from '../../../../../context/NotificationToastContext/NotificationToastContext';
import { POST_FILTERED_PROCESS, DELETE_FILTERED_PROCESS } from '../../../../../utils/endpoints';
import { postRequest, deleteRequest } from '../../../../../utils/api';
import { addProcesses, removeProcessItem } from './ProcessesForm.utility';
import {
    Root,
    HeaderSection,
    BodySection,
    FooterSection,
    SelectSection,
    FieldWrapper,
    AddProcessContainer,
    AddedProcess,
    CustomLoaderDelete,
    CustomChip,
} from './ProcessesForm.style';
import { IFilteredProcesses, IProcesses } from '../Processes.types';

interface Props {
    filteredProcesses: IFilteredProcesses[];
    externalSelectedKidId?: string;
    clearSelectedKidId?: () => void;
}

const ProcessForm = ({ filteredProcesses, externalSelectedKidId, clearSelectedKidId }: Props) => {
    const [processes, setProcesses] = React.useState([...filteredProcesses]);
    const [selectedKidId, setSelectedKidId] = React.useState(filteredProcesses[0]?.id);
    const [processInput, setProcessInput] = React.useState<string>('');
    const [btnLoading, setBtnLoading] = React.useState(false);
    const [selectedProcessToDelete, setSelectedProcessToDelete] = React.useState('');
    const [removeProcessLoading, setRemoveProcessLoading] = React.useState(false);
    const { showNotification } = useNotificationToast();

    React.useEffect(() => {
        setProcesses(filteredProcesses);
    }, [filteredProcesses]);

    React.useEffect(() => {
        if (externalSelectedKidId) {
            setSelectedKidId(externalSelectedKidId || filteredProcesses[0]?.id);
            clearSelectedKidId && clearSelectedKidId();
        }
    }, [clearSelectedKidId, externalSelectedKidId, filteredProcesses]);

    const saveData = async () => {
        setBtnLoading(true);
        const selectedProcesses = addProcesses(processInput, selectedKidId, processes);
        setProcessInput('');
        if (!selectedProcesses || selectedProcesses.processesToAdd.length === 0) {
            /**
             * Here it will check weather the valid processes filtered length is equal to zero means no valid process is present.
             * It won't send API call here to server but only populate the nonfiltered processes in local processes copy.
             */
            const localProcesses: IFilteredProcesses[] = processes.reduce((localProcesses: IFilteredProcesses[], currentKidData: IFilteredProcesses) => {
                if (currentKidData.id === selectedProcesses.id) {
                    localProcesses.push({
                        id: currentKidData.id,
                        name: currentKidData.name || '',
                        processes: selectedProcesses.nonFilteredProcesses || [],
                    });
                } else {
                    localProcesses.push(currentKidData);
                }
                return localProcesses;
            }, []);
            setProcesses(localProcesses);
            setBtnLoading(false);
            return;
        }
        postRequest<{}, IFilteredProcesses>(POST_FILTERED_PROCESS, {
            id: selectedProcesses.id,
            name: selectedProcesses.name,
            processes: selectedProcesses.processesToAdd,
        })
            .then((response) => {
                const responseProcesses = [...response.data.processes];
                const finalProcesseslocal: IFilteredProcesses[] = processes.reduce(
                    (finalProcesses: IFilteredProcesses[], currentKidData: IFilteredProcesses) => {
                        if (currentKidData.id === selectedProcesses.id) {
                            const revisedProcesses = selectedProcesses.nonFilteredProcesses.map((process: IProcesses) => {
                                const newProcesses = responseProcesses.find((nProcess) => nProcess.name === process.name);
                                if (newProcesses) {
                                    const finalnewProcesses = { ...process };
                                    finalnewProcesses['id'] = newProcesses.id;
                                    if (newProcesses.hasOwnProperty('isInvalid')) finalnewProcesses['isInvalid'] = newProcesses.isInvalid;
                                    return finalnewProcesses;
                                } else return process;
                            });
                            finalProcesses.push({
                                id: currentKidData.id,
                                name: currentKidData.name || '',
                                processes: revisedProcesses || [],
                            });
                        } else {
                            finalProcesses.push(currentKidData);
                        }
                        return finalProcesses;
                    },
                    []
                );
                setProcesses(finalProcesseslocal);
                showNotification({
                    type: 'success',
                    message: 'Process added successfully',
                });
            })
            .catch((err: any) => {
                console.log(err);
                showNotification({
                    type: 'error',
                    message: 'Unable to add processes',
                });
            })
            .finally(() => {
                setBtnLoading(false);
            });
    };

    const removeProcess = (selectedProcess: IProcesses) => {
        if (selectedProcessToDelete || btnLoading) return;
        setRemoveProcessLoading(true);
        setSelectedProcessToDelete(selectedProcess.id || '');
        if (selectedProcess.hasOwnProperty('id')) {
            deleteRequest<{}, IFilteredProcesses>(`${DELETE_FILTERED_PROCESS}/${selectedProcess.id}`, {})
                .then((response) => {
                    showNotification({
                        type: 'success',
                        message: `Process ${selectedProcess.name} deleted successfully`,
                    });
                    setProcesses(removeProcessItem(selectedKidId, selectedProcess.name, processes));
                })
                .catch((err: any) => {
                    console.log(err);
                    showNotification({
                        type: 'error',
                        message: `Unable to remove process ${selectedProcess.name}`,
                    });
                })
                .finally(() => {
                    setRemoveProcessLoading(false);
                    setSelectedProcessToDelete('');
                });
        } else {
            setProcesses(removeProcessItem(selectedKidId, selectedProcess.name, processes));
            setRemoveProcessLoading(false);
            setSelectedProcessToDelete('');
            showNotification({
                type: 'success',
                message: `Process ${selectedProcess.name} deleted successfully`,
            });
        }
    };

    return (
        <Root>
            <Formik
                initialValues={{
                    KidsData: processes,
                    selectedKidData: selectedKidId || '',
                }}
                enableReinitialize
                onSubmit={(values: { KidsData: IFilteredProcesses[] }) => {
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
                                            value={selectedKidId}
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
                                    <ul className="process-container">
                                        {getSelectedKidURLs()?.processes.map((process, index) => {
                                            return (
                                                <li className="process-row" key={index.toString()}>
                                                    <div className="process-name">
                                                        {process.hasOwnProperty('isInvalid') ? (
                                                            <>
                                                                <CustomChip isInvalid={process?.isInvalid}>
                                                                    {process?.isInvalid ? 'Invalid' : 'Valid'}
                                                                </CustomChip>
                                                                <AddedProcess invalid={!!validateProcessName(process.name)}>
                                                                    <span>{process.name}</span>
                                                                </AddedProcess>
                                                            </>
                                                        ) : (
                                                            <span>{process.name}</span>
                                                        )}
                                                    </div>

                                                    <CustomLoaderDelete
                                                        loading={selectedProcessToDelete === process.id && removeProcessLoading}
                                                        data-testid="test-remove-btn"
                                                        id="test-remove-btn"
                                                        onClick={() => {
                                                            removeProcess(process);
                                                        }}>
                                                        x
                                                    </CustomLoaderDelete>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </BodySection>
                                <FooterSection>
                                    <AddProcessContainer>
                                        <span>To add more items to this list, copy and paste them here:</span>
                                        <input
                                            placeholder="Enter process(s) here"
                                            value={processInput}
                                            name="add-processes-input"
                                            onChange={(evt) => {
                                                setProcessInput(evt.target.value);
                                            }}
                                        />
                                        <SubmitButton
                                            isSubmitting={btnLoading}
                                            marginTop={0}
                                            text="ADD"
                                            disabled={!processInput}
                                            marginBottom={20}
                                            onClick={(e: React.MouseEvent<HTMLElement>) => {
                                                e.preventDefault();
                                                saveData();
                                            }}
                                            id="test-Add-btn"
                                            data-testid="test-Add-btn"
                                        />
                                    </AddProcessContainer>
                                    <p className="message-for-parent">
                                        NOTE: For the Safe Kids Windows App, you may specify any Windows processes you would like us to bypass our filtering.
                                        This is useful for apps you don’t want us to monitor because you know it’s safe for your child to use.
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

export default ProcessForm;
