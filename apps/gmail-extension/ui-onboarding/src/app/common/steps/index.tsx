import React from "react";
import { Typography } from "@mui/material";
import {makeStyles} from "@mui/styles";
import { AppTheme } from "../theme";
import OnboardingStep from "../onBoardingSteps";
export type StepType = {
  index: number;
  title: string;
  icon: any;
  description?: string;
  url?: string;
};
type StepProps = {
  step: StepType;
  done?: boolean;
  active?: boolean;
  last?: boolean;
  horizontal: boolean;
};
// @ts-ignore
const useStyles = makeStyles((theme: AppTheme) => ({
  root: {
    display: "flex",
    flexDirection: ({ horizontal }: StepProps) =>
      horizontal ? "column" : "row",
    alignItems: "flex-start",
  },
  stepIcon: ({ active, done, horizontal }: StepProps) => {
    const color = done
      ? "#36b37e"
      : active
      ? theme.palette.primary.main
      : theme.colors['lightPeriwinkle'];
    return {
      width: horizontal ? "auto" : "50px",
      flexDirection: horizontal ? "row" : "column",
      display: "flex",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      "& .icon": {
        width: "50px",
        height: "55px",
        border: "1px solid",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: active ? "#fff" : "initial",
        color,
        "& svg": {
          fill: color,
          width: "28px",
          height: "28px",
        },
      },
      "& .step-connector": {
        width: ({ horizontal }: StepProps) => (horizontal ? "80px" : "1px"),
        height: ({ horizontal }: StepProps) => (horizontal ? "1px" : "80px"),
        background: color,
        margin: horizontal ? "auto 10px" : "10px auto",
      },
    };
  },
  stepData: {
    // @ts-ignore
    paddingLeft: ({ horizontal }) => (horizontal ? "0px" : "11px"),
    height: "45px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    "& .step-number": {
      fontSize: "12px",
      height: "14px",
      textTransform: "uppercase",
      color: ({ active }: StepProps) =>
        active ? theme.palette.primary.main : "#c1c7d0",
    },
    "& .step-title": {
      fontSize: "18px",
      height: "18px",
      lineHeight: "1.13",
      marginTop: "5px",
      color: ({ active }: StepProps) => (active ? "initial" : "#c1c7d0"),
    },
  },
}));
const Step: React.FC<StepProps> = (props: StepProps) => {
  const { step, last, done } = props;
  const Icon = step.icon;
  const classes = useStyles(props);
  return (
    <div className={classes.root}>
      <div className={classes.stepIcon}>
        <div className="icon">
          {done ? (
            <img src={"/public/images/extension-imgs/doneIcon.svg"} />
          ) : (
            <Icon />
          )}
        </div>
        {!last && <div className="step-connector"></div>}
      </div>
      <div className="step-detail">
        <div className={classes.stepData}>
          <Typography variant="body1" className="step-number">
            Step {step.index}
          </Typography>
          <Typography variant="subtitle1" className="step-title">
            {step.title}
          </Typography>
        </div>
      </div>
    </div>
  );
};
type Props = {
  steps: StepType[];
  currentStep: StepType;
  horizontal: boolean;
  isSchool?: boolean;
  done?: boolean;
  isConsumer?: boolean;
};
const Steps: React.FC<Props> = ({
  steps,
  currentStep,
  horizontal,
  isSchool,
  done,
  isConsumer,
}: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        marginTop: horizontal ? "28px" : "0px",
      }}
    >
      {steps.map((step, index) =>
        isSchool ? (
          <OnboardingStep
            key={step.index.toString()}
            step={step}
            done={done || currentStep.index > step.index}
            last={index === steps.length - 1}
            isActive={currentStep.index === step.index}
            isConsumer={isConsumer}
          />
        ) : (
          <Step
            key={step.index.toString()}
            step={step}
            done={currentStep.index > step.index}
            active={currentStep.index === step.index}
            last={index === steps.length - 1}
            horizontal={horizontal}
          />
        )
      )}
    </div>
  );
};
export default Steps;
