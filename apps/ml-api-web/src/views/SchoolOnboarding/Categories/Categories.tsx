import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SubmitButton } from '../../../components/InputFields';
import { getRequest, postRequest } from '../../../utils/api';
import { GET_ONBOARDING_CATEGORIES, POST_ONBOARDING_CATEGORIES } from '../../../utils/endpoints';
import { logError } from '../../../utils/helpers';
import ApplyToAllDialog from '../ApplyToAllDialog/ApplyToAllDialog';
import FeatureDescriptionDialog from '../FeatureDescriptionDialog/FeatureDescriptionDialog';
import { Props } from './Categories.types';
import CategoryTable from './CategoryTable/CategoryTable';
import { useNotificationToast } from '../../../context/NotificationToastContext/NotificationToastContext';

const Root = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    & .MuiDialog-paperWidthSm {
        max-width: unset;
    }
`;

const Title = styled.span<{ isSettings: boolean | undefined }>`
    display: flex;
    align-items: center;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: ${(props: any) => (props.isSettings ? '15px' : '28px')};
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
`;

const Description = styled.span`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
`;

const ContinueButton = styled.div`
    margin-top: 50px;
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

const SaveButton = styled.div`
    width: 120px;
    position: absolute;
    bottom: 50px;
    left: 700px;
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

const TableContainer = styled.div<{ isSettings: boolean | undefined }>`
    margin-bottom: ${(props: any) => (props.isSettings ? '130px' : '0')};
`;

const Categories = ({ ouTree, nextStep, isSettings }: Props) => {
    const [selectedOU, setSelectedOU] = useState<any>();
    const [ouData, setOUData] = useState<object[]>([]);
    const [enableApplyToAll, setEnableApplyToAll] = useState<boolean>(false);
    const [showApplyToAllWarning, setShowApplyToAllWarning] = useState<boolean>(false);
    const [categoriesToUpdate, setCategoriesToUpdate] = useState<object[]>([]);
    const [idsToUpdate, setIdsToUpdate] = useState<string[]>([]);
    const [showFeatureDescription, setShowFeatureDescription] = useState<boolean>(false);
    const [featureDescription, setFeatureDescription] = useState<string>('');
    const [defaultCategories, setDefaultCategories] = useState<{ name: string; enable: boolean; editable: boolean }[]>([]);
    const { showNotification } = useNotificationToast();

    const accountType: string | null = localStorage.getItem('account_type');

    const initaliseTree = (nodes: any, newCategories: object[], idList: string[], parentCategories: any[], isCategoriesUpdated?: boolean) => {
        console.log('i am 2', nodes, newCategories, isCategoriesUpdated);
        for (let i = 0; i < nodes.length; i++) {
            if (!isCategoriesUpdated) {
                nodes[i]['categories'] = newCategories;
            }
            if (!nodes[i]['categories']?.length) {
                nodes[i]['categories'] = parentCategories;
            }
            nodes[i]['categories'].sort((a: any, b: any) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
            nodes[i]['parentCategories'] = parentCategories.sort((a: any, b: any) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
            nodes[i]['inherit'] = false;

            if (!nodes[i]['inherit']) {
                setEnableApplyToAll(true);
            }
            idList.push(nodes[i].id);
            if ('children' in nodes[i] && nodes[i].children.length) {
                initaliseTree(nodes[i].children, newCategories, idList, nodes[i]['categories'], isCategoriesUpdated);
            }
        }
        return;
    };

    useEffect(() => {
        console.log(ouTree);
        if (ouTree.length) {
            console.log('i am 1', ouTree);
            getRequest<{}, any[]>(GET_ONBOARDING_CATEGORIES, {})
                .then((response) => {
                    if (response.data) {
                        setDefaultCategories(response.data);
                        const ids: string[] = [];
                        initaliseTree(
                            ouTree,
                            response.data,
                            ids,
                            ouTree[0]['categories']?.length ? ouTree[0]['categories'] : response.data,
                            !!ouTree[0]['categories']?.length,
                        );
                        if (!isSettings) {
                            setIdsToUpdate(ids);
                            setCategoriesToUpdate(response.data);
                        }
                        setOUData(ouTree);
                    }
                })
                .catch((err) => {
                    logError('GET ONBOARDING CATEGORIES', err);
                });
        }
    }, [ouTree]);

    const selectOUHandler = (node: any) => {
        updateCategories();
        setIdsToUpdate([]);
        setCategoriesToUpdate([]);
        setSelectedOU(node);
    };

    const categoryToggle = (categories: any[], categoryName: string, value: boolean) => {
        const newCategories = categories.map((category) => (category.name === categoryName ? { ...category, enabled: value } : category));
        const ids: string[] = [];
        editTree(ouData, newCategories, ids);
        setCategoriesToUpdate(newCategories);
        setIdsToUpdate(ids);
        setSelectedOU({
            ...selectedOU,
            categories: newCategories,
        });
    };

    const editTree = (
        nodes: any[],
        newCategories: any[],
        idList: string[],
        nodeIdToReturn?: string,
        changeCategories?: boolean,
        inheritFromParent?: boolean,
    ) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodeIdToReturn === nodes[i].id) {
                nodes[i].parentCategories = newCategories;
                return;
            }
            if (nodes[i].id === selectedOU.id) {
                if (nodes[i + 1]?.id) {
                    nodeIdToReturn = nodes[i + 1].id;
                }
                if (inheritFromParent) {
                    nodes[i].inherit = true;
                }
                changeCategories = true;
            }
            if (changeCategories) {
                if (selectedOU.id !== nodes[i].id) {
                    nodes[i].parentCategories = newCategories;
                }
                if (nodes[i].inherit || selectedOU.id === nodes[i].id) {
                    if (selectedOU.parentOuId !== null && selectedOU.id === nodes[i].id) {
                        setEnableApplyToAll(JSON.stringify(nodes[i].parentCategories) !== JSON.stringify(newCategories));
                    }
                    idList.push(nodes[i].id);
                    nodes[i].categories = newCategories;
                }
            }
            if ('children' in nodes[i] && nodes[i].children.length && !(selectedOU.id !== nodes[i].id && !nodes[i].inherit && changeCategories)) {
                editTree(nodes[i].children, newCategories, idList, nodeIdToReturn, changeCategories, inheritFromParent);
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
            editTree(ouData, selectedOU.parentCategories, ids, undefined, undefined, true);
            setIdsToUpdate(ids);
            setCategoriesToUpdate(selectedOU.parentCategories);
            setSelectedOU({
                ...selectedOU,
                categories: selectedOU.parentCategories,
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
        initaliseTree(ouTree, ouTree[0].categories, ids, ouTree[0].categories);
        setCategoriesToUpdate(ouTree[0].categories);
        setIdsToUpdate(ids);
        setEnableApplyToAll(false);
        setShowApplyToAllWarning(false);
    };

    const updateCategories = () => {
        if (categoriesToUpdate.length && idsToUpdate.length) {
            postRequest<{}, any[]>(POST_ONBOARDING_CATEGORIES, {
                orgUnitIds: idsToUpdate,
                categories: categoriesToUpdate,
            })
                .then(() => {
                    if (isSettings) {
                        showNotification({
                            type: 'success',
                            message: 'Categories updated successfully.',
                        });
                    }
                })
                .catch((err) => {
                    showNotification({
                        type: 'error',
                        message: 'Failed to update categories.',
                    });
                    logError('POST ONBOARDING CATEGORIES', err);
                });
        }
    };

    const onContinue = () => {
        updateCategories();
        nextStep?.();
    };

    const showFeatureDescriptionDialog = (description: string) => {
        setFeatureDescription(description);
        setShowFeatureDescription(true);
    };
    console.log(selectedOU);

    return (
        <>
            <Root>
                <Title isSettings={isSettings}>Categories</Title>
                <Description>First choose a level. The categories shown are our recommendations, but you may make changes.</Description>
                <TableContainer isSettings={isSettings}>
                    <CategoryTable
                        defaultCategories={defaultCategories}
                        showFeatureDescription={showFeatureDescriptionDialog}
                        applyToAll={() => applyToAll()}
                        isRootNode={selectedOU ? selectedOU.parentOuId === null : true}
                        toggleInherit={toggleInherit}
                        inherit={selectedOU?.inherit}
                        ouData={ouData}
                        categories={selectedOU ? selectedOU.categories : []}
                        categoryToggle={categoryToggle}
                        setOU={selectOUHandler}
                        enableApplyToAll={enableApplyToAll}
                        isSettings={isSettings}
                        accountType={accountType}
                    />
                </TableContainer>
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

export default Categories;
