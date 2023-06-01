import type {ReactNode} from 'react'

import {useSession} from 'next-auth/react'

import {Flex} from '@chakra-ui/react'

import {AuthSplashComponent} from '~/components/auth/AuthSplashComponent'

import Head from './Head'
import type {HeadProps} from './Head'

export interface MainLayoutProps {
  children: ReactNode
  headProps?: HeadProps
}

function MainLayout({children, headProps}: MainLayoutProps) {
  const {data: authData, status: authStatus} = useSession()

  return (
    <>
      <Head {...headProps} />
      <Flex direction="column" flex="1">
        <Flex as="main" direction="column" flex="1" id="main" role="main">
          {authStatus === 'loading' ? null : authData ? children : <AuthSplashComponent />}
        </Flex>
      </Flex>
    </>
  )
}

export default MainLayout
