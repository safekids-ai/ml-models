import React, {useState} from 'react';
import {answerChoices} from '@pages/ui-onboarding/GetStartedContainer/NewFeedback/Feedback.config';
import {
  ChoicesContainer
} from '@pages/ui-onboarding/GetStartedContainer/NewFeedback/selectChoicesNew/selectChoices.style';

interface Props {
  setOption: (arg0: string) => void;
  currentSelectedOption: string;
}

const SelectChoices = ({setOption, currentSelectedOption}: Props) => {
  return (
    <ChoicesContainer>
      {answerChoices?.map((choice, index) => (
        <div
          key={index.toString()}
          className="container"
          onClick={() => {
            setOption(choice.value);
          }}
        >
                    <span id={choice.name} className="choice-text">
                        {choice.name}
                    </span>
          {currentSelectedOption === choice.value &&
            <img src={'/assets/images/prr-icons/ICON_Confirm.svg'} alt="confirm" id="icon-confirm"/>}
        </div>
      ))}
    </ChoicesContainer>
  );
};

export default SelectChoices;
