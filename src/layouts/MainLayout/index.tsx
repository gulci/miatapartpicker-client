import type {ReactNode} from 'react'

import {Center, Container, Divider, Flex, Link, Text} from '@chakra-ui/react'
import {AiFillGithub} from 'react-icons/ai'

import {Head} from './Head'
import type {HeadProps} from './Head'
import {Nav, type NavProps} from './Nav'

export interface MainLayoutProps {
  children: ReactNode
  headProps?: HeadProps
  hideNav?: boolean
  navProps?: NavProps
}

export function MainLayout({children, headProps, hideNav = false, navProps}: MainLayoutProps) {
  return (
    <>
      <Head {...headProps} />
      {!hideNav && <Nav {...navProps} />}
      <Flex direction="column" flex="1">
        <Flex as="main" direction="column" flex="1" id="main" role="main">
          {children}
        </Flex>
      </Flex>
      <Container as="footer" maxW="container.xl" mt={4} paddingBottom="8" textAlign="center">
        <Divider marginY="8" />
        <Center>
          <Link
            _hover={{_light: {color: 'blue.500'}, _dark: {color: 'blue.100'}}}
            isExternal
            href="https://github.com/miata-bot"
          >
            <AiFillGithub size="1.5em" />
          </Link>
        </Center>
      </Container>
    </>
  )
}
