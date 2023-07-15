import {useRouter} from 'next/router'

import {Avatar, HStack, Heading} from '@chakra-ui/react'

import {Banner} from '~/components/ui/Banner'
import {type Profile} from '~/server/mpp/types/users'
import {trpc} from '~/utils/trpc'

interface HeaderProps {
  profile: Profile
}

export function Header({profile: ssrProfile}: HeaderProps) {
  const {
    query: {userId},
  } = useRouter()
  const {data: profile} = trpc.mpp.getUserProfile.useQuery(
    {userId: userId as string},
    {
      initialData: ssrProfile,
    },
  )

  return (
    <Banner _dark={{backgroundColor: 'gray.700'}} _light={{backgroundColor: 'gray.600'}}>
      <Heading as="h1" color="white">
        Profile
      </Heading>
      <HStack
        spacing="4"
        title={`${profile.username}${profile.discriminator !== '0' ? `#${profile.discriminator}` : ''}`}
      >
        <Avatar boxSize="14" name={profile.displayName} src={profile.avatarUrl} />
        <Heading color="whiteAlpha.700" size="md">
          {profile.displayName}
        </Heading>
      </HStack>
    </Banner>
  )
}
