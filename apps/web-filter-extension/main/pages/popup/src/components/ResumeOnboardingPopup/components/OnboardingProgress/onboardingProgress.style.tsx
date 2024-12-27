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
    margin: 4px 0 0 1px;
  }
`;

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;

  .btn-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 14px;
  }
`;

export const IconsSection = styled.div`
  position: relative;
  margin-top: 40px;

  .icon-section-container {
    width: 100%;
    height: auto;
    overflow: hidden;
    display: flex;
    justify-content: center;

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

export const QuestionOval = styled.div<SectionIconsInterface>`
  ${(props) => (props?.currentIndex && props?.questionNumber && props.currentIndex >= props.questionNumber ? QuestionOvalRound : QuestionDottedOvalRound)}
  ${(props) => props.currentIndex === props.questionNumber && `background-color:#fa6400`}
  ${(props) => props.currentIndex && props.questionNumber && props.currentIndex > props.questionNumber && `background-color:#fff`}
`;

export const Description = styled.p`
  margin: 0;
  padding: 0;
  position: absolute;
  width: 290px;
  height: 18px;
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: #4a4a4a;
`;
