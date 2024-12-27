import { Dialog, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { PaymentMethodModalStyled } from './PaymentMethodModal.style';
import { PaymentFormWrapper } from './PaymentFormWrapper/PaymentFormWrapper';

interface Props {
    onClose: () => void;
    selectedPlanId?: string;
    onPaymentComplete: (selectedplan?: string) => Promise<any>;
}

export default function PaymentMethodModal({ onClose, onPaymentComplete, selectedPlanId }: Props) {
    return (
        <Dialog open>
            <PaymentMethodModalStyled>
                <div className="root">
                    <Typography variant="h6" className="title">
                        Payment Method
                    </Typography>
                    <PaymentFormWrapper onBack={onClose} onCompletePayment={onPaymentComplete} selectedPlanId={selectedPlanId} />
                </div>
            </PaymentMethodModalStyled>
        </Dialog>
    );
}
