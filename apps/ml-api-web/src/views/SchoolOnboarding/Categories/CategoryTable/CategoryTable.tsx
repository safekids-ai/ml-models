import { Button, Checkbox, Switch, Tooltip } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { Props } from './CategoryTable.types';
import OUITree from '../../../../components/OUITree/OUITree';

import { HelpIcon } from '../../../../svgs/SchoolOnboarding';
import { FeatureDescriptions } from '../../SchoolOnboardingConstants';

const Root = styled.div`
    display: flex;
    height: inherit;
`;

const LeftTable = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
`;

const RightTable = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
`;

const Heading = styled.span`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 18px;
    border: 1px solid #565555;
    padding: 10px 10px 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
`;

const Content = styled.div`
    align-self: stretch;
    border: 1px solid #565555;
    height: 400px;
    padding: 5px 0 0 0;
    overflow-y: auto;
`;

const CategoryContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px 5px 20px;
    & div {
        width: 210px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 16px;
        color: #4a4a4a;
    }
    & .MuiTooltip-popper {
        top: 10px;
    }
    & .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
        background-color: #e02020;
    }
    & .MuiSwitch-colorSecondary.Mui-disabled + .MuiSwitch-track {
        background-color: #979797;
        border-color: #979797;
        opacity: 1;
    }
    & .MuiSwitch-colorSecondary + .MuiSwitch-track {
        background-color: #0bad37;
    }
    .MuiSwitch-thumb {
        color: #ffffff;
    }
`;
const Spacer = styled.div`
    margin: 20px 10px 20px 20px;
    width: inherit;
    height: 1px;
    background: #000;
`;
const CheckboxContainer = styled.div`
    display: flex;
    & .MuiCheckbox-root {
        padding: 0;
    }
    & span {
        margin-left: 5px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
    }
    & svg {
        cursor: pointer;
        margin-left: 5px;
    }
`;

const ApplyToAll = styled.div`
    display: flex;
    align-items: center;
    & button {
        height: 28px;
    }
    & svg {
        cursor: pointer;
        width: 24px;
        margin-left: 8px;
    }
`;

const HelpContainer = styled.div`
    display: flex;
`;

const CategoryTable = ({
    ouData,
    categories,
    categoryToggle,
    setOU,
    inherit,
    toggleInherit,
    isRootNode,
    enableApplyToAll,
    applyToAll,
    showFeatureDescription,
    isSettings,
    accountType,
    defaultCategories,
}: Props) => {
    const conditional = (category: any, showDisabled: boolean) => {
        if (showDisabled) return defaultCategories.some((cat) => cat.name === category.name && !cat.editable);
        return defaultCategories.some((cat) => cat.name === category.name && cat.editable);
    };
    const getDisabledCategories = (conditional: any) => {
        return categories
            .filter((category) => {
                const editableCategory = conditional(category);
                if (editableCategory) {
                    return category 
                } else {
                    return null;
                }
            })
            .map((category) => {
                return (
                    <CategoryContainer>
                        <Tooltip placement="bottom-start" title={category.name}>
                            <div>{category.name}</div>
                        </Tooltip>
                        <Switch
                            checked={category.enabled}
                            disabled={(inherit && !isRootNode) || defaultCategories.some((cat) => cat.name === category.name && !cat.editable)}
                            onChange={(evt) => categoryToggle(categories, category.name, evt.target.checked)}
                        />
                    </CategoryContainer>
                );
            });
    };
    return (
        <Root>
            <LeftTable>
                <Heading>
                    {!accountType || (accountType === 'SCHOOL' && 'Organizational Units')}
                    {accountType === 'CONSUMER' && 'Family'}
                    <CheckboxContainer>
                        {!isRootNode ? (
                            <>
                                <Checkbox checked={inherit} color="primary" onChange={(evt) => toggleInherit(evt.target.checked)} />
                                <span>Use settings from previous level</span>
                                <HelpContainer onClick={() => showFeatureDescription(FeatureDescriptions.categoriesUsePrevious)}>
                                    <HelpIcon />
                                </HelpContainer>
                            </>
                        ) : (
                            <ApplyToAll>
                                <Button fullWidth variant="contained" color="primary" disabled={!enableApplyToAll} onClick={applyToAll}>
                                    APPLY TO ALL
                                </Button>
                                <HelpContainer onClick={() => showFeatureDescription(FeatureDescriptions.categoriesApplyAll)}>
                                    <HelpIcon />
                                </HelpContainer>
                            </ApplyToAll>
                        )}
                    </CheckboxContainer>
                </Heading>
                <Content>{!!ouData.length && <OUITree data={ouData} setOU={setOU} />}</Content>
            </LeftTable>
            <RightTable>
                <Heading>Categories</Heading>
                <Content>
                    {getDisabledCategories((category: any) => conditional(category, false))}
                    {categories?.length > 0 && <Spacer />}
                    {getDisabledCategories((category: any) => conditional(category, true))}
                </Content>
            </RightTable>
        </Root>
    );
};

export default CategoryTable;
