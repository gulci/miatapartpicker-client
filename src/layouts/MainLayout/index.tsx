import type {ReactNode} from 'react'

import {Flex} from '@chakra-ui/react'

import {Head} from './Head'
import type {HeadProps} from './Head'
import {Nav, type NavProps} from './Nav'

export interface MainLayoutProps {
  children: ReactNode
  headProps?: HeadProps
  hideNav?: boolean
  navProps?: NavProps
}

export function MainLayout({children, headProps, hideNav = false, navProps}: MainLayoutProps) {
  return (
    <>
      <Head {...headProps} />
      {!hideNav && <Nav {...navProps} />}
      <Flex direction="column" flex="1">
        <Flex as="main" direction="column" flex="1" id="main" role="main">
          {children}
        </Flex>
      </Flex>
    </>
  )
}
