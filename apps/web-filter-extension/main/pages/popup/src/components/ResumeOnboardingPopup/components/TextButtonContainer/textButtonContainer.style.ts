import styled, {css} from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-direction: column;

  p {
    margin-top: 40px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #4a4a4a;
  }

  .btn-wrapper {
    margin-top: 18px;
    display: flex;
    justify-content: center;
  }
`;

export const CustomButton = styled.button`
  background: #282828;
  padding: 20px 34px;
  box-shadow: 0px 12px 40px -10px rgba(193, 199, 208, 0.5);
  border-radius: 6.93px;
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 1.25px;
  text-transform: uppercase;
  color: #ffffff;
  cursor: pointer;
`;
