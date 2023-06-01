import type {NextPage} from 'next'
import {type Session} from 'next-auth'
import {SessionProvider, useSession} from 'next-auth/react'
import {type AppType, type AppProps as BaseAppProps} from 'next/app'

import {ChakraProvider} from '@chakra-ui/react'

import {AuthSplashComponent} from '~/components/auth/AuthSplashComponent'
import MainLayout from '~/layouts/MainLayout'
import '~/styles/globals.css'
import {theme} from '~/theme'
import {api} from '~/utils/api'

export type AppPage<P = object, IP = P> = NextPage<P, IP> & {
  auth?: boolean
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

interface AppProps extends BaseAppProps<{session: Session | null}> {
  Component: AppPage
}

const MiataPartPickerClient: AppType<{session: Session | null}> = ({
  Component,
  pageProps: {session, ...pageProps},
}: AppProps) => {
  // Use the layout defined at the page-level, if available.
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>)

  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <WrappedMiataPartPickerClient authRequired={Component.auth} page={getLayout(<Component {...pageProps} />)} />
      </SessionProvider>
    </ChakraProvider>
  )
}

const WrappedMiataPartPickerClient = ({authRequired, page}: {authRequired?: boolean; page: React.ReactNode}) => {
  const {status: authStatus} = useSession()

  if (authStatus === 'authenticated' || !authRequired) return <>{page}</>
  if (authStatus === 'unauthenticated')
    return (
      <MainLayout>
        <AuthSplashComponent />
      </MainLayout>
    )
  return null
}

export default api.withTRPC(MiataPartPickerClient)
