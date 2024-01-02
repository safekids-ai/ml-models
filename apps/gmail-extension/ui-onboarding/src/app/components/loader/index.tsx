import React from "react";
import { styled } from "@mui/material/styles";

type Props = {
  pathColor?: string;
  loaderColor?: string;
  width?: string;
  height?: string;
  primary?: boolean;
};

const StyledLoader = styled('div')<Props>(
  ({ theme, pathColor = "rgba(255,255,255,0.4)", loaderColor = "#fff", width = "24px", height = "24px" }) => ({
    border: `2px solid ${pathColor}`,
    borderTop: `2px solid ${loaderColor}`,
    borderRadius: "50%",
    width: width,
    height: height,
    animation: "$spin 2s linear infinite",

    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  })
);

const Loader: React.FC<Props> = (props) => {
  const { primary, ...restProps } = props;

  const dynamicProps: Partial<Props> = {...restProps};
  if (primary) {
    dynamicProps.pathColor = "rgba(89,57,250,0.4)";
    dynamicProps.loaderColor = "rgba(89,57,250,1)";
  }

  return <StyledLoader {...dynamicProps} />;
};

export default Loader;
