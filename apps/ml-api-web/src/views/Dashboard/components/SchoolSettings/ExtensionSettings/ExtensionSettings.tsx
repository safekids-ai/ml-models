import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getRequest, patchRequest } from '../../../../../utils/api';
import { NON_SCHOOL_DEVICES_CONFIG } from '../../../../../utils/endpoints';
import { logError } from '../../../../../utils/helpers';
import { CheckboxContainer, Root, Title } from './ExtensionSettings.style';

const ExtensionSettings = () => {
    const [enableExtension, setEnableExtension] = useState<boolean>(false);

    useEffect(() => {
        getRequest<{}, any>(NON_SCHOOL_DEVICES_CONFIG, {})
            .then((response) => {
                setEnableExtension(response.data.enableExtension);
            })
            .catch((err) => {
                logError('GET NON SCHOOL DEVICES CONFIG', err);
            });
    }, []);

    const toggleSetting = (value: boolean) => {
        setEnableExtension(value);
        patchRequest<{}, any>(NON_SCHOOL_DEVICES_CONFIG, { enableExtension: value }, {}, true).catch((err) =>
            logError('UPDATE NON SCHOOL DEVICES CONFIG', err),
        );
    };

    return (
        <>
            <Root>
                <Title>Enable/Disable Extension </Title>
                <CheckboxContainer>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={enableExtension} color="primary" onChange={(evt) => toggleSetting(evt.target.checked)} />}
                            label="By checking this box the Safe Kids extension will work on non-school devices."
                        />
                    </FormGroup>
                </CheckboxContainer>
            </Root>
        </>
    );
};

export default ExtensionSettings;
