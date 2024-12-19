import { StepType } from "@src/common/steps";

export type StepProps = {
  step: StepType;
  done: boolean;
  last: boolean;
  isActive: boolean;
  isConsumer: boolean | undefined;
};
