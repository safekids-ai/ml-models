import React, {useState} from 'react';
import {answerChoices} from '@src/GetStartedContainer/NewFeedback/Feedback.config';
import {
  ChoicesContainer
} from '@src/GetStartedContainer/NewFeedback/selectChoicesNew/selectChoices.style';

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
            <img src={'/pages/onboarding/images/ICON_Confirm.svg'} alt="confirm" id="icon-confirm"/>}
        </div>
      ))}
    </ChoicesContainer>
  );
};

export default SelectChoices;
