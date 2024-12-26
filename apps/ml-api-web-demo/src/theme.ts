import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
  },
})

//
// import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
//
// // 2. Add your color mode config
// const config: ThemeConfig = {
//   initialColorMode: 'system',
//   useSystemColorMode: false,
// }
//
// // 3. extend the theme
// const theme = extendTheme({ config })
//
// export default theme
