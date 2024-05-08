import {FormikHelpers} from "formik";
import { Values } from "./PaymentForm/PaymentForm.type";

export type Props = {
    onBack: () => void;
    onCompletePayment: (selectedPlanId?: string) => Promise<any>;
    onFormSubmit?: (values: Values, helpers: FormikHelpers<Values>) => void;
    paddingBottom?: number;
    selectedPlanId?: string;
};