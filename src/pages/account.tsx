import {signOut} from 'next-auth/react'

import {Button, Container, Heading, VStack} from '@chakra-ui/react'

import {type AppPage} from './_app'

const AccountPage: AppPage = () => {
  return (
    <Container display="flex" flexDirection="column" flexGrow="1" maxW="container.lg">
      <VStack>
        <Heading as="h1" marginBottom="8">
          Manage Your Account
        </Heading>
        <Button colorScheme="red" onClick={() => void signOut({callbackUrl: '/'})}>
          Log Out
        </Button>
      </VStack>
    </Container>
  )
}

AccountPage.auth = true

export default AccountPage
