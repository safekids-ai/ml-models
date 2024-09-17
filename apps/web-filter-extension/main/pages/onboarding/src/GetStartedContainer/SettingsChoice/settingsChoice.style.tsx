import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 30px;
`;

export const TopContentSection = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-bottom: 65px;

  img {
    height: 525px;
  }

  .content-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 400px;
    padding-top: 36px;
    margin: 0 100px 0 75px;

    .content-inner-container {
      display: flex;
      flex-direction: column;

      h2 {
        font-family: 'Merriweather';
        font-style: normal;
        font-weight: 900;
        font-size: 28px;
        line-height: 35px;
        letter-spacing: -0.25px;
        color: #4a4a4a;
      }

      .points-section {
        max-width: 426px;

        p {
          font-family: 'Lato';
          font-style: normal;
          font-weight: 400;
          font-size: 20px;
          line-height: 24px;
          letter-spacing: -0.25px;
          color: #000000;
          margin-bottom: 20px;
        }
      }
    }
  }
`;

export const ButtonSection = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 10%;
  gap: 14px;

  button {
    outline: none !important;
    border: none !important;
  }

  #customize-btn {
    cursor: pointer;
    width: 155px;
    height: 60px;
    background: #282828;
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

    &:disabled {
      background-color: #c1c7d0;
    }
  }

  #recommended-settings-btn {
    cursor: pointer;
    width: 296px;
    height: 60px;
    background: rgb(250, 100, 0);
    border-color: rgb(250, 100, 0);
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
  }
`;
