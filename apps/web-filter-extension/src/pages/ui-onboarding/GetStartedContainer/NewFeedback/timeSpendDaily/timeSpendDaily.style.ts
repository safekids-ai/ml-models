import styled, {css} from 'styled-components';
import Select from 'antd/es/select';
import {TimePicker} from 'antd';

const {Option} = Select;

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 520px;

  .question {
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 28px;
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
    margin-top: 40px;
    margin-bottom: 24px;
  }
`;

export const TimeChoiceContainer = styled.div`
  .ant-picker-focused {
    outline: none !important;
    border: 2px solid #000000 !important;
  }

  .time-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 26px;

    .ant-picker:hover {
      outline: none !important;
      border: 2px solid #000000 !important;
    }

    .ant-picker:active {
      outline: none !important;
      border: 2px solid #000000 !important;
    }

    .type {
      width: 190px;
      font-family: 'Merriweather';
      font-style: normal;
      font-weight: 400;
      font-size: 28px;
      line-height: 35px;
      text-align: right;
      letter-spacing: -0.25px;
      color: #4a4a4a;
      text-align: right;
      margin-right: 15px;
    }

    .ant-select {
      width: 200px;
      /* height: 60px; */
      border: none !important;
      outline: none !important;

      .ant-select-selector {
        height: 60px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        color: #000000;
        border-radius: 6.93px;
        outline: none !important;
        border: 2px solid #000000 !important;
        box-shadow: none !important;
      }

      .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
        height: 48px;
      }

      .ant-select-selection-item {
        display: flex;
        align-items: center;
      }
    }
  }
`;

export const CustomSelect = styled(Select)<any>`
  width: 200px;
`;
export const CustomOption = styled(Option)`
  /* height: 60px; */
`;

export const CustomTimePicker = styled(TimePicker)<any>`
  outline: none !important;
  border: 2px solid #000000 !important;
  width: 200px;
  height: 60px;
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
  border-radius: 6.93px;
  outline: none !important;
  border: 2px solid #000000 !important;
  box-shadow: none !important;
  /* .ant-picker-ok {
      button {
          background: rgba(250, 100, 0, 1);
          border-color: rgba(250, 100, 0, 1);
      }
  } */
`;
