import {type GetServerSideProps, type InferGetServerSidePropsType} from 'next'

import {
  Avatar,
  Center,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import {AiOutlineInstagram} from 'react-icons/ai'
import {GiBarefoot, GiHand} from 'react-icons/gi'

import {env} from '~/env.mjs'
import MainLayout from '~/layouts/MainLayout'
import {type AppPage} from '~/pages/_app'
import {getUser as getDiscordUser} from '~/server/discord/requests/users'
import {UserSchema as DiscordUserSchema} from '~/server/discord/types/users'
import {getUser as getMPPUser} from '~/server/mpp/requests/users'
import {UserSchema as MPPUserSchema} from '~/server/mpp/types/users'

const ProfilePage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({profile}) => {
  return (
    <>
      <Center
        _dark={{backgroundColor: 'gray.700'}}
        _light={{backgroundColor: 'gray.600'}}
        marginBottom="8"
        paddingY="8"
      >
        <VStack spacing="4">
          <Heading as="h1" color="white">
            Profile
          </Heading>
          <HStack
            spacing="4"
            title={`${profile.username}${profile.discriminator !== '0' ? `#${profile.discriminator}` : ''}`}
          >
            <Avatar boxSize="14" name={profile.displayName} src={profile.avatarUrl} />
            <Heading color="whiteAlpha.700" size="md">
              {profile.displayName}
            </Heading>
          </HStack>
        </VStack>
      </Center>
      <Container flex="1" maxWidth="container.lg">
        <Stack direction={{base: 'column', lg: 'row'}} spacing={{base: '12', lg: '16'}} flex="1" height="200">
          <Flex maxWidth={{lg: '72'}} width="full">
            <VStack alignItems="start" spacing="4" flex="1">
              <Heading size="md">Account</Heading>
              <Divider />
              <VStack alignItems="start" spacing="4">
                <VStack alignItems="start" spacing="1">
                  <Text as="b">Completed Builds</Text>
                  <Text>{profile.builds.length}</Text>
                  <Text as="small">(User builds page coming soon!)</Text>
                </VStack>
              </VStack>
            </VStack>
          </Flex>
          <Flex width="full">
            <VStack alignItems="start" spacing="4" flex="1">
              <Heading size="md">Profile</Heading>
              <Divider />
              <VStack alignItems="start" spacing="4">
                {profile.foot_size && (
                  <VStack alignItems="start" spacing="1">
                    <Text as="b">Foot Size</Text>
                    <HStack alignItems="center" spacing="2">
                      <Icon as={GiBarefoot} />
                      <Text>{profile.foot_size}</Text>
                    </HStack>
                  </VStack>
                )}
                {profile.hand_size && (
                  <VStack alignItems="start" spacing="1">
                    <Text as="b">Hand Size</Text>
                    <HStack alignItems="center" spacing="2">
                      <Icon as={GiHand} />
                      <Text>{profile.hand_size}</Text>
                    </HStack>
                  </VStack>
                )}
                {profile.instagram_handle && (
                  <VStack alignItems="start" spacing="1">
                    <Text as="b">Instagram</Text>
                    <HStack alignItems="center" spacing="2">
                      <Icon as={AiOutlineInstagram} />
                      <Link
                        href={`https://instagram.com/${profile.instagram_handle}`}
                        target="_blank"
                        textDecoration="underline"
                        rel="noreferrer"
                      >
                        {profile.instagram_handle}
                      </Link>
                    </HStack>
                  </VStack>
                )}
              </VStack>
            </VStack>
          </Flex>
        </Stack>
      </Container>
    </>
  )
}

ProfilePage.getLayout = (page) => {
  return (
    <MainLayout
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
      headProps={{title: `${page.props.profile.displayName} - Profile - MiataPartPicker`}}
      navProps={{disableMargins: true}}
    >
      {page}
    </MainLayout>
  )
}

ProfilePage.auth = true

export default ProfilePage

type ProfilePageProps = {
  profile: {
    avatarUrl: string
    builds: string[]
    discriminator: string
    displayName: string
    foot_size: number | null
    hand_size: number | null
    instagram_handle: string | null
    preferred_timezone: string | null
    preferred_unit: string | null
    username: string
  }
}

export const getServerSideProps: GetServerSideProps<ProfilePageProps, {userId: string}> = async (ctx) => {
  if (!ctx.params) return {notFound: true}
  const discordUserRes = await getDiscordUser(ctx.params.userId)
  if (!discordUserRes.ok) {
    if (discordUserRes.status === 404) return {notFound: true}
    else throw new Error('failed to fetch user from discord')
  }
  const discordUser = DiscordUserSchema.parse(await discordUserRes.json())
  const mppUserRes = await getMPPUser(ctx.params.userId)
  if (!mppUserRes.ok) {
    if (mppUserRes.status === 404) return {notFound: true}
    else throw new Error('failed to fetch user from mpp')
  }
  const mppUser = MPPUserSchema.parse(await mppUserRes.json())

  let avatarUrl = `${env.NEXT_PUBLIC_DISCORD_CDN_ENDPOINT_URL}/embed/avatars/${
    Number(discordUser.discriminator) % 5
  }.png`
  if (discordUser.avatar)
    avatarUrl = `${env.NEXT_PUBLIC_DISCORD_CDN_ENDPOINT_URL}/avatars/${discordUser.id}/${discordUser.avatar}.png`

  return {
    props: {
      profile: {
        avatarUrl,
        builds: mppUser.builds,
        discriminator: discordUser.discriminator,
        displayName: discordUser.display_name,
        foot_size: mppUser.foot_size,
        hand_size: mppUser.hand_size,
        instagram_handle: mppUser.instagram_handle,
        preferred_timezone: mppUser.preferred_timezone,
        preferred_unit: mppUser.prefered_unit,
        username: discordUser.username,
      },
    },
  }
}
