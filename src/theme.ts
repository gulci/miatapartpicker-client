import {type ThemeConfig, extendTheme} from '@chakra-ui/react'
import {type StyleFunctionProps, mode} from '@chakra-ui/theme-tools'

export const theme = extendTheme({
  config: {initialColorMode: 'system', useSystemColorMode: true} as ThemeConfig,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('white', 'gray.800')(props),
      },
      '*::placeholder': {
        opacity: 1,
        color: 'muted',
      },
      '*, *::before, &::after': {
        borderColor: mode('gray.200', 'gray.700')(props),
      },
      'html,body': {
        height: '100%',
      },
      '#__next, #root': {
        display: 'flex',
        flexDirection: 'column',
        minH: '100%',
      },
    }),
  },
})
