import styled from "styled-components";

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: inherit;
  justify-content: space-between;
  .banner-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    padding-right: 90px;
    margin: 40px 0 20px 0;
    .img-1 {
      display: block;
      height: 385px;
      width: 385px;
      border-radius: 50%;
      object-fit: fill;
    }
    .img-2 {
      display: block;
      height: 320px;
      width: 435px;
    }
    .content {
      max-width: 300px;
      display: flex;
      flex-direction: column;
      > h2 {
        font-family: "Merriweather";
        font-style: normal;
        font-weight: 900;
        font-size: 36px;
        line-height: 45px;
        letter-spacing: -0.25px;
        color: #4a4a4a;
      }
      > ul > li:first-child {
        margin-top: 10px;
      }
      > ul {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 20px;
        list-style-type: none;
        margin-bottom: 16px;
        li {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          .dot {
            min-width: 20px;
            max-width: 20px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #5939fa;
            margin-top: 5px;
          }
          span {
            font-family: "Lato";
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 29px;
            letter-spacing: -0.363636px;
            color: #979797;
          }
        }
      }
      > p {
        font-family: "Lato";
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 29px;
        letter-spacing: -0.363636px;
        color: #979797;
      }
    }
  }
  @media only screen and (max-width: 1290px) {
    .banner-section {
      padding-left: 70px;
    }
  }
  .text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    img {
      height: 52px;
      width: 329px;
      margin-top: 5px;
      /* margin-bottom: 25px; */
    }
    .welcome-text {
      font-family: "Merriweather";
      font-style: normal;
      font-weight: 900;
      font-size: 36px;
      line-height: 45px;
      letter-spacing: -0.25px;
      color: #4a4a4a;
    }
    .for-text {
      font-family: "Lato";
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
    }
    .span {
      font-family: "Lato";
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #4a4a4a;
      a {
        color: #fa6400 !important;
        cursor: pointer;
      }
    }
  }
  .text-container .welcome-text {
    margin-bottom: 2px;
  }
  .text-container .for-text {
    margin-left: 100px;
    margin-top: 5px;
  }
`;

export const ContinueButton = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 60px;
  margin-top: 50px;
  & button {
    height: inherit;
    &:hover {
      background-color: #5939fa;
    }
    margin-top: 0;
    background-color: #5939fa;
  }
  & .MuiButton-label {
    font-family: "Lato";
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 1.25px;
    text-transform: uppercase;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-top: 54px;
  padding-right: 90px;
  padding-bottom: 40px;
  padding-left: 120px;
  a {
    color: #5939fa;
    text-decoration: underline;
  }
`;

export const AlignCenter = styled.div`
  min-height: 100vh;
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
