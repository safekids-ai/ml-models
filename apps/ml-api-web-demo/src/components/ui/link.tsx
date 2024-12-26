import { Button } from "./button"
import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react"
import * as React from "react"
import { useNavigate } from "react-router-dom";

export interface ButtonProps extends ChakraButtonProps {
  to: string
}

export const Link = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Link(props, ref) {
    const { to: linkHref, children, ...rest } = props

    const navigate = useNavigate();
    function handleClick() {
      navigate(linkHref)
    }
    return (
      <Button ref={ref} {...rest} onClick={handleClick}>
        { children }
      </Button>
    )
  },
)