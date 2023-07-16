import {useEffect} from 'react'

import type {NextPage} from 'next'
import {type Session} from 'next-auth'
import {SessionProvider, useSession} from 'next-auth/react'
import {type AppType, type AppProps as BaseAppProps} from 'next/app'
import {useRouter} from 'next/router'

import {ChakraProvider} from '@chakra-ui/react'
import {Analytics} from '@vercel/analytics/react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import {AuthSplashComponent} from '~/components/auth/AuthSplashComponent'
import {MainLayout} from '~/layouts/MainLayout'
import {theme} from '~/theme'
import {trpc} from '~/utils/trpc'

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
  const {events: routerEvents} = useRouter()

  // Configure loading bar
  NProgress.configure({
    showSpinner: false,
  })

  // Use the layout defined at the page-level, if available.
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>)

  useEffect(() => {
    function startLoader() {
      NProgress.start()
    }

    routerEvents.on('routeChangeStart', startLoader)

    return () => {
      routerEvents.off('routeChangeStart', startLoader)
    }
  }, [routerEvents])

  useEffect(() => {
    function stopLoader() {
      NProgress.done()
    }

    routerEvents.on('routeChangeComplete', stopLoader)

    return () => {
      routerEvents.off('routeChangeComplete', stopLoader)
    }
  }, [routerEvents])

  return (
    <>
      <ChakraProvider theme={theme}>
        <SessionProvider session={session}>
          <WrappedMiataPartPickerClient authRequired={Component.auth} page={getLayout(<Component {...pageProps} />)} />
        </SessionProvider>
      </ChakraProvider>
      <Analytics />
    </>
  )
}

const WrappedMiataPartPickerClient = ({authRequired, page}: {authRequired?: boolean; page: React.ReactNode}) => {
  const {status: authStatus} = useSession()

  if (authStatus === 'authenticated' || !authRequired) return <>{page}</>
  if (authStatus === 'unauthenticated')
    return (
      <MainLayout hideNav>
        <AuthSplashComponent />
      </MainLayout>
    )
  return null
}

export default trpc.withTRPC(MiataPartPickerClient)
