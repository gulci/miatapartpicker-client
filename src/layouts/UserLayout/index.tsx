import {type ReactNode} from 'react'

import {Container} from '@chakra-ui/react'

import {type Profile} from '~/server/mpp/types/users'

import {MainLayout} from '../MainLayout'
import {Header} from './Header'

interface UserLayoutProps {
  children: ReactNode
  profile: Profile
}

export function UserLayout({children, profile}: UserLayoutProps) {
  return (
    <MainLayout
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
      headProps={{title: `${profile.displayName} - Profile - MiataPartPicker`}}
      navProps={{disableMargins: true}}
    >
      <Header profile={profile} />
      <Container flex="1" maxWidth="container.lg">
        {children}
      </Container>
    </MainLayout>
  )
}
