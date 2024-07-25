import styled from "styled-components";

export const Root = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
  .heading {
    font-family: "Merriweather";
    font-style: normal;
    font-weight: 900;
    font-size: 28px;
    line-height: 35px;
    letter-spacing: -0.25px;
    color: #4a4a4a;
    padding-bottom: 35px;
    width: 530px;
    text-align: center;
  }
  .footer {
    margin-top: 50px;
    width: 1000px;
  }
  .images-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .image-container {
      display: flex;
      flex-direction: column;
      text-align: center;
      width: 460px;
      span {
        font-family: "Lato";
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        text-align: center;
        color: #000000;
      }
    }
  }
`;
