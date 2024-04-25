import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { getInitials, logError } from '../../../utils/helpers';
import PinInputField from 'react-pin-field';
import { SubmitButton } from '../../../components/InputFields';
import { getRequest } from '../../../utils/api';
import { CONSUMER_KID } from '../../../utils/endpoints';
import { useNotificationToast } from '../../../context/NotificationToastContext/NotificationToastContext';
import { ContinueButton, Root, Title, StepsList } from './NextSteps.style';

export type KidInfo = {
    id?: string;
    firstName: string;
    lastName: string;
    accessCode?: string;
    email?: string;
    status?: string;
    yearOfBirth?: string;
    categories: [];
};

const NextSteps = ({ finishOnboardings }: { finishOnboardings: () => void }) => {
    const [kids, setkids] = useState<KidInfo[]>([]);
    const { showNotification } = useNotificationToast();
    useEffect(() => {
        getRequest<{}, KidInfo[]>(CONSUMER_KID, {})
            .then(({ data }) => {
                setkids(data);
            })
            .catch((err) => {
                showNotification({
                    type: 'error',
                    message: 'Failed to get kids',
                });
                logError('CONSUMER_KID', err);
            });
    }, [showNotification]);

    const setAccessCode = (ref: any, accessCode: string) => {
        ref?.forEach((input: any, index: number) => (input.value = accessCode[index]));
    };

    return (
        <Root>
            <Title>Next Steps</Title>
            <StepsList>
                <li>
                    <span className="step-number">1</span>
                    <span className="step-description">Keep this page open and go to your kids device</span>
                </li>
                <li>
                    <span className="step-number">2</span>
                    <span className="step-description">
                        Navigate to{' '}
                        <u>
                            <a target="_blank" href={'https://chrome.google.com/webstore/detail/safe-kids-ai-at-home/ankjncjgmdnfdnigddppomdlcdkdkpok'} rel="noreferrer">
                                home.safekids.ai
                            </a>
                        </u>
                    </span>
                </li>
                <li>
                    <span className="step-number">3</span>
                    <span className="step-description">Download the extension</span>
                </li>
            </StepsList>
            <ContinueButton>
                <SubmitButton isSubmitting={false} text="Finish" onClick={finishOnboardings} id={'add-kids-submit-button'} />
            </ContinueButton>
            <div className="content">
                <div className="kid-info-list">
                    {kids.map((kid) => {
                        const fullName = `${kid.firstName} ${kid.lastName}`;
                        return (
                            <div className="kid-info-container">
                                <div className="kid-info">
                                    <Avatar>{getInitials(fullName)}</Avatar>
                                    <span className="kid-name">{`${fullName}`}</span>
                                </div>
                                <div className="access-code-container">
                                    <span>Access Code</span>
                                    <div className="access-code-field">
                                        <PinInputField length={6} disabled={true} ref={(ref) => setAccessCode(ref, kid?.accessCode ? kid.accessCode : '')} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Root>
    );
};

export default NextSteps;
