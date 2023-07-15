import {type BoxProps, Center, VStack} from '@chakra-ui/react'

export function Banner({children, ...props}: BoxProps) {
  return (
    <Center marginBottom="8" paddingY="8" {...props}>
      <VStack spacing="4">{children}</VStack>
    </Center>
  )
}
