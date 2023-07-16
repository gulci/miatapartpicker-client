import {type BoxProps, Center, Container, VStack} from '@chakra-ui/react'

export function Banner({children, ...props}: BoxProps) {
  return (
    <Center marginBottom="8" paddingY="8" {...props}>
      <Container maxWidth="container.xl" paddingX="4">
        <VStack spacing="4">{children}</VStack>
      </Container>
    </Center>
  )
}
