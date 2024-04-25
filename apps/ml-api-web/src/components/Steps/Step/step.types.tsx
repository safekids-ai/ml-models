import { StepType } from '../Steps';

export type StepProps = {
    step: StepType;
    done: boolean;
    last: boolean;
    isActive: boolean;
    isConsumer: boolean | undefined;
};
