import React from 'react';
import {act, cleanup, render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import COPPA from "./COPPA/COPPA";

afterEach(cleanup);

const COPPAComponent : JSX.Element = (
    <COPPA></COPPA>
)

test('it renders coppa screen', async () => {
    const { getByText } = render(COPPAComponent);
    await waitFor(() => expect(getByText("COPPA Parental Consent")).toBeTruthy());

});

test('it renders legal authority confirmation radio button', async () => {
    const { getByLabelText } = render(COPPAComponent);
    await waitFor(() => expect(getByLabelText('hasLegalAuthorityToInstall')).toBeTruthy());
});

test('it renders bound by privacy policy checkbox', async () => {
    const { getByLabelText } = render(COPPAComponent);
    await waitFor(() => expect(getByLabelText('boundByPrivacyPolicy')).toBeTruthy());
});

test('Next button is disabled until all required fields are filled', async () => {
    const { getByLabelText, getByTestId } = render(COPPAComponent);
    await waitFor(() => expect(getByLabelText('hasLegalAuthorityToInstall')).toBeTruthy());
    const hasLegalAuthorityButton = getByLabelText('hasLegalAuthorityToInstall-Yes');
    const boundByPrivacyPolicyCheck = getByLabelText('boundByPrivacyPolicy');
    const NextButton: HTMLElement = getByTestId("COPPA-submit-button");
    const hasDisabledAttrBefore = NextButton.hasAttribute('disabled');

    expect(hasDisabledAttrBefore).toBeTruthy();
    await act( async () => {
        await userEvent.click(hasLegalAuthorityButton);
    })
    const hasDisabledAttr2 = NextButton.hasAttribute('disabled');

    expect(hasDisabledAttr2).toBeTruthy();
    await act( async () => {
        await userEvent.click(boundByPrivacyPolicyCheck);
    })

    const hasDisabledAttrAfter = NextButton.hasAttribute('disabled');

    expect(hasDisabledAttrAfter).toBeFalsy();
});
