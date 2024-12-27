import styled, {css} from 'styled-components';

type SectionIconsInterface = {
  questionNumber?: number;
  currentIndex?: number;
};

const QuestionOvalRound = css`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #f46400;
`;

const QuestionDottedOvalRound = css`
  padding: 5px 7px 7px 8px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #f46400;
  background: #ffffff;

  &::before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 14px;
    -moz-border-radius: 7.5px;
    -webkit-border-radius: 7.5px;
    border-radius: 50%;
    background-color: #f46400;
  }
`;

export const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    height: 500px;
    padding-right: 80px;
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
`;

export const QuestionOval = styled.div<SectionIconsInterface>`
  ${(props) => (props?.currentIndex && props?.questionNumber && props.currentIndex >= props.questionNumber ? QuestionOvalRound : QuestionDottedOvalRound)}
  ${(props) => props.currentIndex === props.questionNumber && `background-color:#fa6400`}
  ${(props) => props.currentIndex && props.questionNumber && props.currentIndex > props.questionNumber && `background-color:#fff`}
`;

export const IconsSection = styled.div`
  position: relative;

  .icon-section-container {
    height: 35px;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    margin-bottom: 45px;

    .ovals-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 4px;
      animation-name: onload-pause;
      animation-duration: 1s;
    }
  }
`;

export const TextSection = styled.section`
  animation-name: onload-btn;
  animation-duration: 0.2s;

  margin: 20px 0 10px 0;
  font-size: 26px;
  animation-name: onload-text;
  animation-duration: 1s;

  .prr2-screenD-text {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    max-width: 570px;
  }

  .prr2-screenD-text .can-we-talk-about-it {
    margin-top: 0;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 28px;
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
  }

  .prr2-screenD-text .choose-following {
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 30px;
    letter-spacing: -0.1875px;
    color: #4a4a4a;
    margin: 21px 0 14px 0;
  }

  .content-prr-level-2 {
    padding-left: 0;
  }
`;

export const ButtonSection = styled.section`
  margin-top: 36px;
  animation-name: onload-btn;
  animation-duration: 0.2s;

  text-align: center;
  padding: 10px;
  position: relative;
  background-color: #fff;
  margin: 10px;
  display: flex;
  justify-content: center;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 50%;
    width: 245px;
    height: 60px;
    border-radius: 7px;
    transition: 0.5s;
    cursor: pointer;

    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1.25px;
    text-transform: uppercase;
    color: #ffffff;
  }

  .enable-btn {
    background: #fa6400;
    border-color: #fa6400;
    color: #fff !important;
  }

  .disable-btn {
    pointer-events: none;
    background: #c1c7d0;
    border-color: transparent;
    color: #fff !important;
  }
`;

export const SectionSplitter = styled.div`
  min-height: 500px;
`;
