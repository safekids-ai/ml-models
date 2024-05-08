import styled from 'styled-components';

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: white;
  position: relative;
  & .loading-text {
    font-family: "Lato";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #000;
    position: absolute;
    left: calc(50% - 72px);
    top: 50px;
}
  }
  & .red-text {
    color: #f7274a !important;
  }
`;
