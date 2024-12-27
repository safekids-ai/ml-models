import styled from "styled-components";

export const Root = styled.div`
  min-height: inherit;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  background: white;
  padding: 40px 90px 38px 120px;
  justify-content: space-between;
  .container {
    display: flex;
    flex-direction: column;
    a {
      display: flex;
      flex-direction: column;
      text-decoration: none !important;
      color: #000 !important;
      img {
        width: 210px;
        height: 32px;
        object-fit: fill;
      }
      span {
        font-family: "Lato";
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        margin-top: 5px;
        margin-left: 100px;
      }
    }
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-top: 100px;
  a {
    color: #5939fa;
    text-decoration: underline;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  justify-content: flex start;
  align-items: start;
`;

export const Content = styled.div`
  margin-left: 12%;
  align-self: stretch;
`;

export const Description = styled.span`
  height: 80px;
  margin-top: 20px;
  line-height: 18px;
  max-width: 630px;
  color: #000;
`;
