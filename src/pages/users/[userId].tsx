import {useEffect} from 'react'

import {type GetServerSideProps, type InferGetServerSidePropsType} from 'next'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'

import {
  Avatar,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  Link,
  Stack,
  Text,
  VStack,
  useBoolean,
  useToast,
} from '@chakra-ui/react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {AiOutlineInstagram} from 'react-icons/ai'
import {GiBarefoot, GiHand} from 'react-icons/gi'

import MainLayout from '~/layouts/MainLayout'
import {type AppPage} from '~/pages/_app'
import {type UserInput, UserInputSchema} from '~/server/mpp/types/users'
import {getUserProfile} from '~/server/mpp/users'
import {trpc} from '~/utils/trpc'

const ProfilePage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({profile: ssrProfile}) => {
  const [editing, setEditing] = useBoolean(false)
  const toast = useToast()
  const {
    query: {userId},
  } = useRouter()
  const {data: profile} = trpc.mpp.getUserProfile.useQuery(
    {userId: userId as string},
    {
      initialData: ssrProfile,
    },
  )
  const {
    mpp: {getUserProfile: getUserProfileUtils},
  } = trpc.useContext()
  const updateProfile = trpc.mpp.protectedUpdateUserProfile.useMutation({
    onError: () => {
      toast({
        position: 'top',
        status: 'error',
        title: "Couldn't update profile :(",
      })
    },
    onSuccess: async () => {
      await getUserProfileUtils.invalidate({userId: userId as string})
      toast({
        position: 'top',
        status: 'success',
        title: 'Profile updated',
      })
    },
  })
  const {data: authData} = useSession()
  const {handleSubmit, register} = useForm<UserInput>({
    defaultValues: {
      foot_size: profile.foot_size?.toString() ?? '',
      hand_size: profile.hand_size?.toString() ?? '',
      instagram_handle: profile.instagram_handle ?? '',
      prefered_unit: profile.preferred_unit ?? '',
      preferred_timezone: profile.preferred_timezone ?? '',
    },
    resolver: zodResolver(UserInputSchema),
  })

  useEffect(() => {
    if (!authData) setEditing.off()
  }, [authData, setEditing])

  function onSubmit(data: UserInput) {
    updateProfile.mutate(data)
    setEditing.off()
  }

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
              {!editing ? (
                <VStack alignItems="start" spacing="4" width="full">
                  {!profile.foot_size && !profile.hand_size && !profile.instagram_handle && (
                    <Text as="i">This user has not added any information.</Text>
                  )}
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
                  {authData && userId === authData.user.id && (
                    <Button colorScheme="blue" onClick={setEditing.on} marginTop="8">
                      Edit Profile
                    </Button>
                  )}
                </VStack>
              ) : (
                <VStack as="form" alignItems="start" onSubmit={handleSubmit(onSubmit)} spacing="4" width="full">
                  <FormControl>
                    <FormLabel>Foot Size</FormLabel>
                    <Input {...register('foot_size')} step=".01" type="number" width="full" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Hand Size</FormLabel>
                    <Input {...register('hand_size')} step=".01" type="number" width="full" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Instagram</FormLabel>
                    <Input {...register('instagram_handle')} width="full" />
                  </FormControl>
                  <HStack marginTop="8" spacing="4">
                    <Button colorScheme="gray" onClick={setEditing.off}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" type="submit">
                      Update Profile
                    </Button>
                  </HStack>
                </VStack>
              )}
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
  const profile = await getUserProfile(ctx.params.userId)
  if (!profile) return {notFound: true}
  return {
    props: {
      profile,
    },
  }
}
