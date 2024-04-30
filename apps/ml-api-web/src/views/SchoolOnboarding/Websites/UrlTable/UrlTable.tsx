import { Button, Checkbox, Tab } from '@mui/material';
import React from 'react';
import { FixedSizeList } from 'react-window';

import OUITree from '../../../../components/OUITree/OUITree';
import { Props } from './UrlTable.types';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
    Root,
    LeftTable,
    RightTable,
    Heading,
    CheckboxContainer,
    ApplyToAll,
    HelpContainer,
    UrlContainer,
    RemoveIcon,
    AddedUrl,
    Content,
    Undo,
} from './UrlTable.style';
import { HelpIcon } from '../../../../svgs/SchoolOnboarding';
import { FeatureDescriptions } from '../../SchoolOnboardingConstants';

const UrlTable = ({
    ouData,
    urls,
    setOU,
    removeUrls,
    inherit,
    toggleInherit,
    isRootNode,
    enableApplyToAll,
    applyToAll,
    showFeatureDescription,
    isSettings,
    handleTabChange,
    tabValue,
    accountType,
}: Props) => {
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
                                <HelpContainer onClick={() => showFeatureDescription(FeatureDescriptions.websitesUsePrevious)}>
                                    <HelpIcon />
                                </HelpContainer>
                            </>
                        ) : (
                            <ApplyToAll>
                                <Button fullWidth variant="contained" color="primary" disabled={!enableApplyToAll} onClick={applyToAll}>
                                    APPLY TO ALL
                                </Button>
                                <HelpContainer onClick={() => showFeatureDescription(FeatureDescriptions.websitesApplyAll)}>
                                    <HelpIcon />
                                </HelpContainer>
                            </ApplyToAll>
                        )}
                    </CheckboxContainer>
                </Heading>
                <Content>{!!ouData.length && <OUITree data={ouData} setOU={setOU} />}</Content>
            </LeftTable>
            <RightTable isSettings={isSettings}>
                {!!urls.filter((url) => url.hasOwnProperty('isInvalid')).length && !isSettings && (
                    <Undo
                        onClick={() => removeUrls(urls.filter((url) => url.hasOwnProperty('isInvalid')).map((url) => url.name))}
                        disable={inherit && !isRootNode}
                    >
                        UNDO
                    </Undo>
                )}
                <TabContext value={tabValue}>
                    <TabList
                        onChange={handleTabChange}
                        TabIndicatorProps={{
                            style: {
                                bottom: '-3px',
                                height: '4.5px',
                                display: isSettings ? 'inline' : 'none',
                            },
                        }}
                    >
                        <Tab label="Always Allowed" value="1" />
                        <Tab label={isSettings ? 'Intercepted' : ''} value="2" />
                    </TabList>
                    <TabPanel value="1">
                        <Content>
                            <FixedSizeList height={390} width={295} itemSize={30} itemCount={urls.length}>
                                {({ index, style }: any) => {
                                    const url = urls.filter((_url) => _url.enabled)[index];
                                    return !url ? null : (
                                        <div style={style}>
                                            <UrlContainer>
                                                {url.hasOwnProperty('isInvalid') ? (
                                                    <AddedUrl invalid={url.isInvalid}>
                                                        <a target="_blank" href={url.name.search('http') !== -1 ? url.name : `https://${url.name}`} rel="noreferrer">
                                                            {url.name}
                                                        </a>
                                                    </AddedUrl>
                                                ) : (
                                                    <span>
                                                        <a target="_blank" href={`https://${url.name}`} rel="noreferrer">
                                                            {url.name}
                                                        </a>
                                                    </span>
                                                )}
                                                <RemoveIcon onClick={() => removeUrls(url.name)} disable={inherit && !isRootNode}>
                                                    x
                                                </RemoveIcon>
                                            </UrlContainer>
                                        </div>
                                    );
                                }}
                            </FixedSizeList>
                        </Content>
                    </TabPanel>
                    {isSettings && (
                        <TabPanel value="2">
                            <Content>
                                <FixedSizeList height={390} width={295} itemSize={30} itemCount={urls.length}>
                                    {({ index, style }: any) => {
                                        const url = urls.filter((_url) => !_url.enabled)[index];
                                        return !url ? null : (
                                            <div style={style}>
                                                <UrlContainer>
                                                    {url.hasOwnProperty('isInvalid') ? (
                                                        <AddedUrl invalid={url.isInvalid}>
                                                            <a target="_blank" href={url.name.search('http') !== -1 ? url.name : `https://${url.name}`} rel="noreferrer">
                                                                {url.name}
                                                            </a>
                                                        </AddedUrl>
                                                    ) : (
                                                        <span>
                                                            <a target="_blank" href={`https://${url.name}`} rel="noreferrer">
                                                                {url.name}
                                                            </a>
                                                        </span>
                                                    )}
                                                    <RemoveIcon onClick={() => removeUrls(url.name)} disable={inherit && !isRootNode}>
                                                        x
                                                    </RemoveIcon>
                                                </UrlContainer>
                                            </div>
                                        );
                                    }}
                                </FixedSizeList>
                            </Content>
                        </TabPanel>
                    )}
                </TabContext>
            </RightTable>
        </Root>
    );
};

export default UrlTable;
