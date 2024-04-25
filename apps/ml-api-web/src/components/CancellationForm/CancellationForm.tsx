import React, { useState } from 'react';
import { CancellationFormStyled, FeedbackInputStyled } from './CancellationForm.style';
import { Dialog, Typography } from '@material-ui/core';
import { CustomSelection } from '../CustomSelection/CustomSelection';
import { SubmitButton } from '../InputFields';
import CloseIcon from '@material-ui/icons/Close';
import { deleteRequest } from '../../utils/api';
import { useNotificationToast } from '../../context/NotificationToastContext/NotificationToastContext';
import { UPDATE_USER_PLAN } from '../../utils/endpoints';

interface Props {
    onClose: () => void;
}

const feedbackOptions: string[] = [
    'The cost of service is too high.',
    "Our family doesn't need this level of protection anymore.",
    `We're dissatisfied with the service Safe kids provides.`,
];

export const CancellationForm = ({ onClose }: Props) => {
    const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
    const [customFeedback, setCustomFeedback] = useState<string>('');
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const { showNotification } = useNotificationToast();

    const onSubmitFeedback = () => {
        setSubmitting(true);
        const feedback = customFeedback ? [...selectedFeedback, customFeedback] : selectedFeedback;

        deleteRequest<{}, any>(UPDATE_USER_PLAN, { feedback })
            .then(async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                showNotification({
                    type: 'success',
                    message: `You have cancelled your subscription and will not be charged anymore`,
                });

                onClose();
            })
            .catch(() => {
                setSubmitting(false);
                showNotification({
                    type: 'error',
                    message: `Unable to cancel your subscription`,
                });
            });
    };

    const onCustomFeedbackChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setCustomFeedback(event.target.value);
    };
    const onFeedbackSelect = (value: string) => {
        const updatedFeedback = selectedFeedback.filter((val) => val !== value);
        if (updatedFeedback.length === selectedFeedback.length) {
            updatedFeedback.push(value);
        }
        setSelectedFeedback(updatedFeedback);
    };

    return (
        <Dialog open>
            <CancellationFormStyled>
                <div className="root">
                    <div className="cancellation-header">
                        <Typography variant="h6" className="title">
                            Safe Kids Cancellation
                        </Typography>
                        <CloseIcon className="close-form" onClick={onClose} />
                    </div>
                    <span className="choose-text">CHOOSE ONE OR MORE REASONS WHY YOU WANT TO CANCEL</span>
                    <CustomSelection
                        selectedValues={selectedFeedback}
                        values={feedbackOptions}
                        onSelect={(value) => {
                            onFeedbackSelect(value);
                        }}
                    />
                    <span className="tell-text">TELL US IN YOUR OWN WORDS WHY YOU WANT TO CANCEL</span>

                    <>
                        <FeedbackInputStyled
                            variant="outlined"
                            multiline
                            rows={4}
                            rowsMax={4}
                            placeholder="Enter another reason here"
                            value={customFeedback}
                            onChange={onCustomFeedbackChange}
                        />
                        <SubmitButton
                            className={`confirm-cancellation`}
                            isSubmitting={isSubmitting}
                            onClick={onSubmitFeedback}
                            text="CONFIRM CANCELLATION"
                            marginTop={10}
                        />
                    </>
                </div>
            </CancellationFormStyled>
        </Dialog>
    );
};
