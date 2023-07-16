import {signIn, useSession} from 'next-auth/react'
import NextLink from 'next/link'

import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  type DrawerProps,
  HStack,
  Heading,
  Icon,
  LinkOverlay,
  Text,
  VStack,
} from '@chakra-ui/react'
import {SiDiscord} from 'react-icons/si'

interface MobileMenuProps extends Omit<DrawerProps, 'children'> {
  onSignOut: () => Promise<void>
}

export function MobileMenu({onSignOut, ...props}: MobileMenuProps) {
  const {data: authData, status: authStatus} = useSession()

  return (
    <Drawer {...props}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader />
        <DrawerBody paddingTop="8">
          {authStatus === 'authenticated' && (
            <VStack alignItems="end" spacing="8">
              <Button variant="link">
                <NextLink
                  href={{pathname: '/users/[userId]', query: {userId: authData?.user.id}}}
                  legacyBehavior
                  passHref
                >
                  <LinkOverlay>
                    <Heading size="lg">Profile</Heading>
                  </LinkOverlay>
                </NextLink>
              </Button>
              <Button variant="link">
                <NextLink
                  href={{pathname: '/users/[userId]/builds', query: {userId: authData?.user.id}}}
                  legacyBehavior
                  passHref
                >
                  <LinkOverlay>
                    <Heading size="lg">Your Builds</Heading>
                  </LinkOverlay>
                </NextLink>
              </Button>
            </VStack>
          )}
        </DrawerBody>
        {authStatus !== 'loading' && (
          <DrawerFooter _dark={{borderColor: 'gray.600'}} _light={{borderColor: 'gray.300'}} borderTopWidth="1px">
            {authStatus === 'authenticated' ? (
              <HStack alignItems="center" justify="space-between" width="full">
                <HStack spacing="4" overflow="hidden">
                  <Avatar
                    name={authData?.user.name ?? undefined}
                    size="sm"
                    src={authData?.user.image ?? undefined}
                    title="Manage Your Profile"
                  />

                  <Text size="lg" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                    {authData?.user.name}
                  </Text>
                </HStack>
                <Button onClick={() => void onSignOut()} variant="ghost">
                  Log Out
                </Button>
              </HStack>
            ) : (
              <Button
                onClick={() => void signIn('discord')}
                variant="ghost"
                rightIcon={<Icon as={SiDiscord} boxSize="5" />}
                iconSpacing="3"
              >
                Log in with Discord
              </Button>
            )}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
