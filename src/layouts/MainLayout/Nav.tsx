import {signIn, signOut, useSession} from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  SkeletonCircle,
  forwardRef,
} from '@chakra-ui/react'
import {useQueryClient} from '@tanstack/react-query'
import {SiDiscord} from 'react-icons/si'

import miataLogo from '../../../public/icons/miata.png'

const NavAvatar = forwardRef((props, ref) => {
  const {data: authData} = useSession()

  return (
    <Avatar
      boxSize="10"
      name={authData?.user.name ?? undefined}
      showBorder
      src={authData?.user.image ?? undefined}
      ref={ref}
      title="Manage Your Profile"
      {...props}
    />
  )
})

export interface NavProps {
  disableMargins?: boolean
}

export function Nav({disableMargins = false}: NavProps) {
  const {data: authData, status: authStatus} = useSession()
  const queryClient = useQueryClient()

  async function onSignOut() {
    await signOut({redirect: false})
    queryClient.removeQueries({
      // clears any tRPC procedures with names that begin with `protected`;
      // procedures that begin with the term `protected` are intended to only
      // be accessed by a user that is authenticated; when a user signs out,
      // any local state (including caches) should immediately reflect that.
      // thus, this `removeQueries` call is made to immediately clear any local
      // query caches for "protected" procedures.
      predicate: (query) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        Array.isArray(query.queryKey) &&
        Array.isArray(query.queryKey[0]) &&
        query.queryKey[0].length === 2 &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        query.queryKey[0][1].startsWith('protected'),
    })
  }

  let userComponent = (
    <Button
      onClick={() => void signIn('discord')}
      variant="outline"
      leftIcon={<Icon as={SiDiscord} boxSize="5" />}
      iconSpacing="3"
    >
      Log in with Discord
    </Button>
  )
  if (authStatus === 'loading') userComponent = <SkeletonCircle size="10" />
  else if (authStatus === 'authenticated')
    userComponent = (
      <Menu>
        <MenuButton as={NavAvatar}>
          <Portal>
            <MenuList>
              <Link href={{pathname: '/users/[userId]', query: {userId: authData.user.id}}} legacyBehavior passHref>
                <MenuItem as="a">Profile</MenuItem>
              </Link>
              <MenuItem onClick={() => onSignOut()}>Log Out</MenuItem>
            </MenuList>
          </Portal>
        </MenuButton>
      </Menu>
    )

  return (
    <Box as="section" marginBottom={!disableMargins ? 8 : undefined}>
      <Box as="nav" boxShadow="sm" _dark={{backgroundColor: 'gray.900'}} _light={{backgroundColor: 'gray.50'}}>
        <Container maxWidth="container.lg" py={{base: '3', lg: '4'}}>
          <Flex justify="space-between">
            <HStack spacing="4">
              <Link href="/">
                <HStack>
                  <Image
                    alt="MiataPartPicker logo"
                    priority
                    src={miataLogo}
                    style={{objectFit: 'contain', maxHeight: '50px', width: 'auto'}}
                  />
                  <Heading size="md">MiataPartPicker</Heading>
                </HStack>
              </Link>
            </HStack>
            <HStack spacing="4">{userComponent}</HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}
