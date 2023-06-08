import {Box, Center, Container, Text, VStack} from '@chakra-ui/react'

import {type AppPage} from './_app'

const HomePage: AppPage = () => {
  return (
    <Container display="flex" flexDirection="column" justifyContent="center" flexGrow="1" maxWidth="container.lg">
      <Center>
        <VStack>
          <Box as="h1" fontSize={{base: 'xl', lg: '6xl'}} textAlign="center">
            Under Construction
          </Box>
          <Text>You&apos;ll be able to update your builds here soon! :)</Text>
        </VStack>
      </Center>
    </Container>
  )
}

HomePage.auth = true

export default HomePage
