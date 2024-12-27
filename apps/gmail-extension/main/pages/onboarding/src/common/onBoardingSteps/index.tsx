import React from "react";
import styled from "styled-components";
import { StepProps } from "@src/common/onBoardingSteps/onboarding.types";

const StepContainer = styled.div`
  display: flex;
`;

const StepConnector = styled.div`
  background-color: #000;
  width: 1px;
  height: 28px;
  margin: 10px 0;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StepDetail = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.5px;
  height: 45px;
  justify-content: center;
  margin-left: 12px;
`;

const ConnectorContainer = styled.div`
  display: flex;
  margin: auto;
`;

const Icon = styled.div<{
  complete: boolean;
  active: boolean;
  consumer: boolean | undefined;
}>`
  display: flex;
  border: 1px solid
    ${(props: any) =>
      !props.complete && !props.active
        ? "#B5B5B5"
        : props.active
        ? props.consumer
          ? "#5939fa"
          : "#5939fa"
        : "transparent"};
  border-radius: 4px;
  height: 45px;
  width: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) =>
    props.complete ? (props.consumer ? "#5939fa" : "#5939fa") : "white"};
`;

const Next = styled.span<{ active: boolean; consumer: boolean | undefined }>`
  color: ${(props: any) =>
    !props.active ? "#C1C7D0" : props.consumer ? "#5939fa" : "#5939fa"};
`;

const Title = styled.span<{ active: boolean }>`
  margin-top: 5px;
  font-size: 16px;
  color: ${(props: any) => (!props.active ? "#C1C7D0" : "#000")};
`;

const OnboardingStep = ({
  step,
  last,
  done,
  isActive,
  isConsumer,
}: StepProps) => {
  const IconToShow = step.icon;
  return (
    <StepContainer>
      <ImageContainer>
        <Icon complete={done} active={isActive} consumer={isConsumer}>
          {done ? (
            <img src={"/images/extension-imgs/check-icon.png"} />
          ) : isActive ? (
            IconToShow
          ) : (
            ""
          )}
        </Icon>
        <ConnectorContainer>
          {!last && <StepConnector></StepConnector>}
        </ConnectorContainer>
      </ImageContainer>
      <StepDetail>
        <Next active={isActive && !done} consumer={isConsumer}>
          NEXT
        </Next>
        <Title active={isActive && !done}>{step.title}</Title>
      </StepDetail>
    </StepContainer>
  );
};

export default OnboardingStep;
