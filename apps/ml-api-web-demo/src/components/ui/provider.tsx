"use client"

import { ChakraProvider, createSystem, defaultConfig, defineConfig, mergeConfigs } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

const customConfig = defineConfig({
  theme: {
    breakpoints: {
      root: "0em", // 0px
      sm: "30em", // ~480px
      md: "48em", // ~768px
      lg: "62em", // ~992px
      xl: "80em", // ~1280px
      "2xl": "96em", // ~1536px
    }
  },
})

const config = mergeConfigs(defaultConfig, customConfig)
const system = createSystem(config)
console.log(system)
export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
