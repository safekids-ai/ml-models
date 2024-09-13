import styled, {css} from 'styled-components';

import IconCommunication from '@public/assets/images/prr-icons/ICON_Communication.svg';
import IconConfirm from '@public/assets/images/prr-icons/ICON_Confirm.svg';
import IconCountDown from '@public/assets/images/prr-icons/ICON_Count-Down.svg';
import IconPause from '@public/assets/images/prr-icons/ICON_Pause.svg';
import IconReflect from '@public/assets/images/prr-icons/ICON_Reflect.svg';

export const MainSection = styled.main`
  padding: 5rem 1rem;

  > .container {
    max-width: 521px;
  }

  .capitalize {
    text-transform: capitalize;
  }

  .flex {
    display: flex;
  }

  .m-t-20 {
    margin-top: 20px !important;
  }

  .m-t-26 {
    margin-top: 20px !important;
  }

  @keyframes onload-btn {
    0% {
      top: 0;
      visibility: hidden;
      opacity: 0;
    }
    75% {
      top: -5px;
      visibility: hidden;
      opacity: 0;
    }
    100% {
      top: 0;
      visibility: visible;
      opacity: 1;
    }
  }
  @keyframes onload-text {
    0% {
      left: 0;
      visibility: hidden;
      opacity: 0;
    }
    75% {
      left: 5px;
      visibility: hidden;
      opacity: 0;
    }
    100% {
      left: 0;
      visibility: visible;
      opacity: 1;
    }
  }
  @keyframes onload-pause {
    0%,
    75% {
      visibility: hidden;
      opacity: 0;
    }
    100% {
      visibility: visible;
      opacity: 1;
    }
  }
  @keyframes onload-dot {
    0% {
      width: 1px;
      height: 1px;
      visibility: hidden;
      opacity: 0;
    }
    100% {
      width: 92px;
      height: 92px;
      visibility: visible;
      opacity: 1;
    }
  }
  @keyframes onload-bar-left {
    0%,
    75% {
      right: 0;
    }
    100% {
      right: 181px;
    }
  }
  @keyframes onload-bar-right {
    0%,
    75% {
      left: calc(100% + 113px);
      right: -181px;
    }
    100% {
      left: 423px;
      right: 0;
    }
  }
  @keyframes onload-link-more {
    0%,
    75% {
      visibility: hidden;
      opacity: 0;
    }
    100% {
      visibility: visible;
      opacity: 1;
    }
  }
`;

export const IconsSection = styled.section`
  position: relative;

  > .container {
    position: relative;
    height: 92px;
    overflow: hidden;
  }

  > .container:before {
    content: '';
    position: absolute;
    left: 0;
    right: 181px;
    top: 50%;
    height: 1px;
    background-color: #979797;
    animation-name: onload-bar-left;
    animation-duration: 1s;
  }

  > .container:after {
    content: '';
    position: absolute;
    left: 390px;
    top: 50%;
    right: 0;
    height: 1px;
    background-color: #979797;
    animation-name: onload-bar-right;
    animation-duration: 1s;
  }

  .icon-pause {
    position: absolute;
    left: 60px;
    top: 0;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    overflow: hidden;
  }

  .icon-pause:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 92px;
    height: 92px;
    background-color: #f7274a;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation-name: onload-dot;
    animation-duration: 0.5s;
  }

  .icon-pause:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 92px;
    height: 92px;
    background: url(${IconPause}) no-repeat;
    transform: translate(-50%, -50%);
    animation-name: onload-pause;
    animation-duration: 1s;
  }

  .icon-reflect {
    display: none;
  }

  .icon-check {
    display: none;
  }

  .link-more {
    color: #f7274a !important;
    position: absolute;
    right: 73px;
    top: 50%;
    transform: translateY(-50%);
    animation-name: onload-link-more;
    animation-duration: 1.5s;
  }

  a:hover,
  a:focus {
    text-decoration: underline !important;
    color: #f7274a !important;
    cursor: pointer !important;
  }
`;

export const ContainerLevel3 = styled.div`
  position: relative;
  height: 92px;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background-color: #979797;
    animation-name: onload-bar-left;
    animation-duration: 1s;
  }

  .icon-pause,
  .icon-communication {
    position: initial;
    left: 60px;
    top: 0;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    overflow: hidden;
  }

  .icon-pause,
  .icon-countDown {
    position: initial;
    left: 60px;
    top: 0;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    overflow: hidden;
  }

  .icon-reflect,
  .icon-check {
    display: block;
    position: initial;
    left: 60px;
    top: 0;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    overflow: hidden;
  }

  .icon-pause:before,
  .icon-reflect:before,
  .icon-communication:before,
  .icon-check:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 92px;
    height: 92px;
    background-color: #f7274a;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation-name: onload-dot;
    animation-duration: 0.5s;
  }

  .icon-pause:before,
  .icon-reflect:before,
  .icon-countDown:before,
  .icon-check:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 92px;
    height: 92px;
    background-color: #f7274a;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation-name: onload-dot;
    animation-duration: 0.5s;
  }

  .icon-pause:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 92px;
    height: 92px;
    background: url(${IconPause}) no-repeat;
    transform: translate(-50%, -50%);
    animation-name: onload-pause;
    animation-duration: 1s;
  }

  .icon-reflect:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 92px;
    height: 92px;
    background: url(${IconReflect}) no-repeat;
    transform: translate(-50%, -50%);
    animation-name: onload-pause;
    animation-duration: 1s;
  }

  .icon-check:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 92px;
    height: 92px;
    background: url(${IconConfirm}) no-repeat;
    transform: translate(-50%, -50%);
    animation-name: onload-pause;
    animation-duration: 1s;
  }

  .icon-communication:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 92px;
    height: 92px;
    background: url(${IconCommunication}) no-repeat;
    transform: translate(-50%, -50%);
    animation-name: onload-pause;
    animation-duration: 1s;
  }

  .icon-countDown:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 92px;
    height: 92px;
    background: url(${IconCountDown}) no-repeat;
    transform: translate(-50%, -50%);
    animation-name: onload-pause;
    animation-duration: 1s;
  }

  .ovals-container {
    position: absolute;
    display: flex;
    flex-direction: row;
    left: 75%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation-name: onload-pause;
    animation-duration: 1s;
  }

  .ovals-container .question-oval {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: solid 1px #e02020;
    margin: 0 4px;
  }
`;

const commonTextProps = css`
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  font-family: Merriweather;
  color: #4a4a4a;
`;

export const TextSection = styled.section`
  margin-top: 30px;
  font-size: 26px;
  animation-name: onload-text;
  animation-duration: 1s;

  .capitalize {
    text-transform: capitalize;
  }

  .alert-message {
    position: relative;
    left: 0;
    transition: 0.5s;

    p {
      text-align: start;
    }
  }

  .more-info {
    display: none;
    height: 1px;

    p {
      text-align: start;
    }
  }

  .feedback {
    display: none;

    p {
      text-align: start;
    }
  }

  small {
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    font-weight: 700;
  }

  small a {
    text-decoration: underline;
    color: #f7274a;
  }

  small a:hover,
  small a:focus {
    text-decoration: none;
    color: #f7274a;
    cursor: pointer;
  }

  .limited-access-width {
    width: 325px;
  }

  .looks-distracted {
    height: 60px;
  }

  .delayed-text {
    animation-name: onload-text;
    animation-duration: 1.8s;
  }

  .prr2-screenD-text {
    display: flex;
    flex-direction: column;
    max-width: 570px;
  }

  .prr2-screenD-text .can-we-talk-about-it {
    margin-top: 15px;
  }

  .content-prr-level-2 {
    padding-left: 0;
  }

  .ai-inform-text {
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
  }

  .it-looks-like-you-are {
    height: 150px;
    margin: 13px 0 71px;
    letter-spacing: -0.25px;
    ${commonTextProps}
  }

  .screen2-last-text {
    height: 70px;
    margin: 5px 0 -35px;
    letter-spacing: -0.25px;
    text-align: justify;
    ${commonTextProps}
  }

  .italic-font {
    font-style: italic;
    font-weight: 900
  }

  .ask-inform-text {
    height: 150px;
    margin: 13px 0 13px;
    letter-spacing: -0.25px;
    text-align: justify;
    ${commonTextProps}
  }

  main .everyone-needs-some {
    width: 666px;
    font-size: 26px;
    letter-spacing: -0.25px;
    ${commonTextProps}
  }

  .please-talk-to-teachers {
    width: 666px;
    height: 50px;
    font-size: 26px;
    letter-spacing: -0.25px;
    ${commonTextProps}
  }

  .national-Suicide-Pre {
    width: 491px;
    height: 27px;
    font-size: 21px;
    letter-spacing: -0.16px;
    ${commonTextProps}
  }

  .emergency-number {
    width: 456px;
    height: 75px;
    font-size: 60px;
    letter-spacing: -0.47px;
    ${commonTextProps}
  }

  .or-talk-to-one-of-yo {
    width: 510px;
    margin: 26px 0.5px 0 0;

    font-size: 26px;
    letter-spacing: -0.25px;

    ${commonTextProps}
  }

  .allowed-url-list-container {
    border: 1px solid #979797;
    display: flex;
    flex-direction: column;
    height: 220px;
    overflow: auto;
    font-size: 15px;
    width: 350px;
    margin-left: 20px;
    margin-top: 50px;
    padding: 10px;
  }

  .prr2-screenB-text {
    display: flex;
    flex-direction: column;
    max-width: 592px;
  }

  .prr2-screen-text1 {
    display: flex;
    flex-direction: column;
    max-width: 570px;
  }

  .prr2-screen-text1 .prr2-screen-text2 {
    margin-top: 15px;
  }

  .prr2-screen-text1 .input-container {
    width: 491px;
    height: 69px;
    margin: 16px 0 16px 4px;
    padding: 11px 0 11px 15px;
    border-radius: 6.9px;
    border: solid 1px #dfe1e6;
    background-color: #fff;
  }

  .prr2-screen-text1 .response-input {
    font-size: 16px;
    min-width: 470px;
    height: 29px;
    border: 0;
    outline: 0;
    font-family: none;
  }

  .allowed-url-list-container a {
    font-weight: normal;
    color: red;
  }

  .explicit-content-p {
    width: 510px;
  }

  .looks-distracted {
    height: 60px;
  }
`;

const commonButtonProps = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 1.25px;
  text-transform: uppercase;
`;

export const ButtonsSection = styled.section`
  margin-top: 60px;
  animation-name: onload-btn;
  animation-duration: 2s;

  .btn {
    color: #fff;
    position: relative;
    top: 0;
    width: 243px;
    height: 60px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.25px;
    border-radius: 7px;
    transition: 0.5s;
    margin: 0 20px;
    ${commonButtonProps}
  }

  .btn-dark {
    color: #fff !important;
    letter-spacing: 1.25px;
    transition: 0.5s;
    background-color: #343a40 !important;
    border-color: #343a40;
  }

  .btn-light {
    padding: 22px 40px 20px;
    box-shadow: 0 12px 40px -10px rgba(193, 199, 208, 0.5);
    background-color: #fff;
    border: solid 1px #282828;
    color: #282828;
  }

  .prr2-buttons {
    margin: 10px;
    padding: 10px;
    position: relative;
    background-color: #fff;
    ${commonButtonProps}
  }

  .prr2-buttons a {
    max-width: 50%;
  }

  .prr2-buttons .disable-button {
    pointer-events: none;
    background-color: #c1c7d0;
    border-color: transparent;
  }

  .container {
    display: flex;
    justify-content: flex-end;
  }
`;

export const ChoiceContainer = styled.div`
  border-radius: 24px;
  background-color: #f4f5f7;
  display: flex;
  flex-direction: column;
  animation-name: onload-pause;
  animation-duration: 1s;

  .choice-container {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px #979797;
    font-family: Merriweather;
    font-size: 20px;
    padding: 16px 20px;
  }

  .choice-container:last-of-type {
    border-bottom: none;
  }

  .choice-container .icon-confirm {
    width: 30px;
    height: 30px;
    background: url(${IconConfirm}) no-repeat;
    background-size: cover;
  }
`;
