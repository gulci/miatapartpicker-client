import type {ReactNode} from 'react'

import {Flex} from '@chakra-ui/react'

import Head from './Head'
import type {HeadProps} from './Head'
import {Nav} from './Nav'

export interface MainLayoutProps {
  children: ReactNode
  headProps?: HeadProps
  hideNav?: boolean
}

function MainLayout({children, headProps, hideNav = false}: MainLayoutProps) {
  return (
    <>
      <Head {...headProps} />
      {!hideNav && <Nav />}
      <Flex direction="column" flex="1">
        <Flex as="main" direction="column" flex="1" id="main" role="main">
          {children}
        </Flex>
      </Flex>
    </>
  )
}

export default MainLayout
