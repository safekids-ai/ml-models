import React, { ElementType } from 'react';

import Step from './Step/Step';
export type StepType = {
    index: number;
    title: string;
    icon: ElementType;
    description?: string;
    url?: string;
};

type Props = {
    steps: StepType[];
    currentStep: StepType;
    horizontal: boolean;
    isSchool?: boolean;
    done?: boolean;
    isConsumer?: boolean;
};
const Steps: React.FC<Props> = ({ steps, currentStep, horizontal, done, isConsumer }: Props) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: horizontal ? 'row' : 'column',
                marginTop: horizontal ? '28px' : '0px',
            }}
        >
            {steps.map((step, index) => (
                <Step
                    key={step.index}
                    step={step}
                    done={done || currentStep.index > step.index}
                    last={index === steps.length - 1}
                    isActive={currentStep.index === step.index}
                    isConsumer={isConsumer}
                />
            ))}
        </div>
    );
};
export default Steps;
