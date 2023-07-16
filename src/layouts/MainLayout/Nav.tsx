import {useEffect} from 'react'

import {signIn, signOut, useSession} from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {
  Avatar,
  Box,
  Button,
  Container,
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
  useDisclosure,
} from '@chakra-ui/react'
import {useQueryClient} from '@tanstack/react-query'
import {GiHamburgerMenu} from 'react-icons/gi'
import {SiDiscord} from 'react-icons/si'

import miataLogo from '../../../public/icons/miata.png'
import {MobileMenu} from './MobileMenu'

const NavAvatar = forwardRef((props, ref) => {
  const {data: authData} = useSession()

  return (
    <Avatar
      _dark={{borderColor: 'gray.600'}}
      name={authData?.user.name ?? undefined}
      size="40px"
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
  const {isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onClose: onMobileMenuClose} = useDisclosure()
  const {events: routerEvents} = useRouter()
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

  useEffect(() => {
    routerEvents.on('routeChangeComplete', onMobileMenuClose)
    return () => {
      routerEvents.off('routeChangeComplete', onMobileMenuClose)
    }
  }, [onMobileMenuClose, routerEvents])

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
  if (authStatus !== 'unauthenticated')
    userComponent = (
      <SkeletonCircle isLoaded={authStatus !== 'loading'} size="40px">
        <Menu>
          <MenuButton cursor="pointer" as={NavAvatar}>
            <Portal>
              <MenuList>
                <Link href={{pathname: '/users/[userId]', query: {userId: authData?.user.id}}} legacyBehavior passHref>
                  <MenuItem as="a">Profile</MenuItem>
                </Link>
                <Link
                  href={{pathname: '/users/[userId]/builds', query: {userId: authData?.user.id}}}
                  legacyBehavior
                  passHref
                >
                  <MenuItem as="a">Your Builds</MenuItem>
                </Link>
                <MenuItem onClick={() => onSignOut()}>Log Out</MenuItem>
              </MenuList>
            </Portal>
          </MenuButton>
        </Menu>
      </SkeletonCircle>
    )

  return (
    <>
      <Box as="section" marginBottom={!disableMargins ? 8 : undefined}>
        <Box as="nav" boxShadow="sm" _dark={{backgroundColor: 'gray.900'}} _light={{backgroundColor: 'gray.50'}}>
          <Container maxWidth="container.lg" py={{base: '3', lg: '4'}}>
            <HStack alignItems="center" justify="space-between">
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
              <Box display={{base: 'none', lg: 'block'}}>
                <HStack spacing="4">{userComponent}</HStack>
              </Box>
              <Box display={{base: 'block', lg: 'none'}}>
                <Button
                  _light={{color: 'blackAlpha.600'}}
                  _dark={{color: 'whiteAlpha.600'}}
                  onClick={onMobileMenuOpen}
                  variant="outline"
                >
                  <GiHamburgerMenu />
                </Button>
              </Box>
            </HStack>
          </Container>
        </Box>
      </Box>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={onMobileMenuClose} onSignOut={onSignOut} placement="right" />
    </>
  )
}
