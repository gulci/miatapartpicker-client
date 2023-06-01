import {type NextPage} from 'next'

import {Box, Center, Container, Text, VStack} from '@chakra-ui/react'

import {api} from '~/utils/api'

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({text: 'from tRPC'})

  return (
    <Container maxW="container.lg">
      <Center>
        <VStack>
          <Box as="h1" fontSize="6xl" textAlign="center" mt="10">
            MiataPartPicker
          </Box>
          <Text>{hello.data ? hello.data.greeting : 'Loading tRPC query...'}</Text>
        </VStack>
      </Center>
    </Container>
  )
}

export default Home
