import styled from "styled-components";

export const Root = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 75px;
  padding-left: 80px;
  padding-bottom: 20px;

  span {
    font-family: "Lato";
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;

    a {
      color: #fa6400 !important;
      text-decoration: underline !important;
      cursor: pointer;
    }
  }
`;
