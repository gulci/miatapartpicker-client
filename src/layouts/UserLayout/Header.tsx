import NextLink from 'next/link'
import {useRouter} from 'next/router'

import {Avatar, Button, type ButtonProps, HStack, Heading, Link, LinkBox, LinkOverlay} from '@chakra-ui/react'

import {Banner} from '~/components/ui/Banner'
import {type Profile} from '~/server/mpp/types/users'
import {trpc} from '~/utils/trpc'

interface HeaderProps {
  profile: Profile
  title: string
}

function HeaderButton(props: ButtonProps) {
  return (
    <Button
      _light={{
        _active: {
          color: 'gray.800',
        },
        _hover: {
          color: 'gray.800',
        },
        color: 'whiteAlpha.900',
      }}
      borderBottomRadius="0"
      padding="4"
      variant="ghost"
      {...props}
    >
      {props.children}
    </Button>
  )
}

export function Header({profile: ssrProfile, title}: HeaderProps) {
  const {
    query: {userId},
    route,
  } = useRouter()
  const {data: profile} = trpc.mpp.getUserProfile.useQuery(
    {userId: userId as string},
    {
      initialData: ssrProfile,
    },
  )

  return (
    <Banner _dark={{backgroundColor: 'gray.700'}} _light={{backgroundColor: 'gray.600'}} paddingBottom="0">
      <Heading as="h1" color="white">
        {title}
      </Heading>
      <HStack
        spacing="4"
        title={`${profile.username}${profile.discriminator !== '0' ? `#${profile.discriminator}` : ''}`}
      >
        <Avatar boxSize="14" name={profile.displayName} src={profile.avatarUrl} />
        <Heading color="whiteAlpha.700" size="md">
          <NextLink href={{pathname: '/users/[userId]', query: {userId}}} legacyBehavior passHref>
            <Link color="unset">{profile.displayName}</Link>
          </NextLink>
        </Heading>
      </HStack>
      <HStack marginTop="2" spacing="4">
        <LinkBox>
          <HeaderButton isActive={route === '/users/[userId]'}>
            <NextLink href={{pathname: '/users/[userId]', query: {userId}}} legacyBehavior passHref>
              <LinkOverlay>Profile</LinkOverlay>
            </NextLink>
          </HeaderButton>
        </LinkBox>
        <LinkBox>
          <HeaderButton isActive={route === '/users/[userId]/builds'}>
            <NextLink href={{pathname: '/users/[userId]/builds', query: {userId}}} legacyBehavior passHref>
              <LinkOverlay>Builds</LinkOverlay>
            </NextLink>
          </HeaderButton>
        </LinkBox>
      </HStack>
    </Banner>
  )
}
