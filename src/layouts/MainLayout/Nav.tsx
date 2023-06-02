import {signIn, useSession} from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

import {Avatar, Box, Button, Container, Flex, HStack, Heading, Icon, SkeletonCircle, Text} from '@chakra-ui/react'
import {SiDiscord} from 'react-icons/si'

import miataLogo from '../../../public/icons/miata.png'

export function Nav() {
  const {data: authData, status: authStatus} = useSession()

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
  else if (authStatus === 'authenticated') {
    if (authData.user.name && authData.user.image)
      userComponent = <Avatar boxSize="10" name={authData.user.name} src={authData.user.image} />
    else if (authData.user.name) userComponent = <Text>{authData.user.name}</Text>
    else userComponent = <Text>{authData.user.id}</Text>
  }

  return (
    <Box as="section">
      <Box as="nav" boxShadow="sm" _dark={{backgroundColor: 'gray.900'}} _light={{backgroundColor: 'gray.50'}}>
        <Container maxW="container.lg" py={{base: '3', lg: '4'}}>
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
