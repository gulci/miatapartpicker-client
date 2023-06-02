import {signIn} from 'next-auth/react'
import Image from 'next/image'

import {Button, Container, Heading, Icon, Stack} from '@chakra-ui/react'
import {SiDiscord} from 'react-icons/si'

import miataLogo from '../../../public/icons/miata.png'

export const AuthSplashComponent = () => (
  <Container
    display="flex"
    flexDirection="column"
    justifyContent="center"
    flexGrow="1"
    maxW="md"
    py={{base: '12', md: '24'}}
  >
    <Stack spacing="8">
      <Stack spacing="6">
        <Image
          alt="MiataPartPicker logo"
          priority
          src={miataLogo}
          style={{objectFit: 'contain', maxHeight: '100px', width: 'auto'}}
        />
        <Stack spacing={{base: '2', md: '3'}} textAlign="center">
          <Heading size={{base: 'xs', md: 'sm'}}>Log in with Discord to manage your builds and profile.</Heading>
        </Stack>
      </Stack>
      <Stack spacing="6">
        <Stack spacing="3">
          <Button
            onClick={() => void signIn('discord')}
            variant="outline"
            leftIcon={<Icon as={SiDiscord} boxSize="5" />}
            iconSpacing="3"
          >
            Continue with Discord
          </Button>
        </Stack>
      </Stack>
    </Stack>
  </Container>
)
