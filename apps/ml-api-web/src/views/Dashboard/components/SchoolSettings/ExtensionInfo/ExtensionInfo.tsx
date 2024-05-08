import React from 'react';
import ExtensionDescription from './ExtensionDescription/ExtensionDescription';
import { Root, Title } from './ExtensionInfo.style';

const ExtensionInfo = () => (
    <Root>
        <Title>Extension Information</Title>
        <ExtensionDescription />
    </Root>
);

export default ExtensionInfo;
