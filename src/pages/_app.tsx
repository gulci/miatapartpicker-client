import {type Session} from 'next-auth'
import {SessionProvider} from 'next-auth/react'
import {type AppType, type AppProps as BaseAppProps} from 'next/app'

import {ChakraProvider} from '@chakra-ui/react'

import {type NextPageWithLayout} from '~/layouts'
import MainLayout from '~/layouts/MainLayout'
import '~/styles/globals.css'
import {theme} from '~/theme'
import {api} from '~/utils/api'

interface AppProps extends BaseAppProps<{session: Session | null}> {
  Component: NextPageWithLayout
}

const MiataPartPickerClient: AppType<{session: Session | null}> = ({
  Component,
  pageProps: {session, ...pageProps},
}: AppProps) => {
  // Use the layout defined at the page-level, if available.
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>)

  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>{getLayout(<Component {...pageProps} />)}</SessionProvider>
    </ChakraProvider>
  )
}

export default api.withTRPC(MiataPartPickerClient)
