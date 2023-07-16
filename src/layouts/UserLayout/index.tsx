import {type ReactNode} from 'react'

import {Container} from '@chakra-ui/react'

import {type Profile} from '~/server/mpp/types/users'

import {MainLayout} from '../MainLayout'
import {Header} from './Header'

interface UserLayoutProps {
  children: ReactNode
  profile: Profile
  title: string
}

export function UserLayout({children, profile, title}: UserLayoutProps) {
  return (
    <MainLayout
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
      headProps={{title: `${profile.displayName} - ${title} - MiataPartPicker`}}
      navProps={{disableMargins: true}}
    >
      <Header profile={profile} title={title} />
      <Container flex="1" maxWidth="container.lg" paddingBottom={{base: '4', lg: '0'}}>
        {children}
      </Container>
    </MainLayout>
  )
}
