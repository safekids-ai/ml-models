import React from 'react';
import { Description } from '../ExtensionDescription/ExtensionDescription.style';
import { extensionID, extensionURL } from '../../../../../../constants';

const ExtensionDescription = () => (
    <Description>
        Your extension ID is: {extensionID}
        <br />
        Your extension URL is: {extensionURL}
        <br />
        Here are some{' '}
        <a href="Docs/Installation_Instructions.pdf" target="_blank">
            instructions for installation.
        </a>{' '}
    </Description>
);

export default ExtensionDescription;
