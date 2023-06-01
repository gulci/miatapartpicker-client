import type {ReactNode} from 'react'

import {Flex} from '@chakra-ui/react'

import Head from './Head'
import type {HeadProps} from './Head'

export interface MainLayoutProps {
  children: ReactNode
  headProps?: HeadProps
}

function MainLayout({children, headProps}: MainLayoutProps) {
  return (
    <>
      <Head {...headProps} />
      <Flex direction="column" flex="1">
        <Flex as="main" direction="column" flex="1" id="main" role="main">
          {children}
        </Flex>
      </Flex>
    </>
  )
}

export default MainLayout
