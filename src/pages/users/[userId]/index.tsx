import {type ReactElement, useEffect} from 'react'

import {type GetServerSideProps, type InferGetServerSidePropsType} from 'next'
import {useSession} from 'next-auth/react'
import NextLink from 'next/link'
import {useRouter} from 'next/router'

import {
  Button,
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

import {UserLayout} from '~/layouts/UserLayout'
import {type AppPage} from '~/pages/_app'
import {type Profile, type UserInput, UserInputSchema} from '~/server/mpp/types/users'
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
  const {handleSubmit, register, reset} = useForm<UserInput>({
    defaultValues: {
      foot_size: profile.foot_size?.toString() ?? '',
      hand_size: profile.hand_size?.toString() ?? '',
      instagram_handle: profile.instagram_handle ?? '',
      prefered_unit: profile.preferred_unit ?? '',
      preferred_timezone: profile.preferred_timezone ?? '',
    },
    resolver: zodResolver(UserInputSchema),
  })

  function onSubmit(data: UserInput) {
    updateProfile.mutate(data)
    setEditing.off()
  }

  useEffect(() => {
    if (!profile) return
    reset({
      foot_size: profile.foot_size?.toString() ?? '',
      hand_size: profile.hand_size?.toString() ?? '',
      instagram_handle: profile.instagram_handle ?? '',
      prefered_unit: profile.preferred_unit ?? '',
      preferred_timezone: profile.preferred_timezone ?? '',
    })
  }, [profile, reset])

  return (
    <Stack direction={{base: 'column', lg: 'row'}} spacing={{base: '12', lg: '16'}} flex="1">
      <Flex maxWidth={{lg: '72'}} width="full">
        <VStack alignItems="start" spacing="4" flex="1">
          <Heading size="md">Account</Heading>
          <Divider />
          <VStack alignItems="start" spacing="4">
            <VStack alignItems="start" spacing="1">
              <Text as="b">Builds</Text>
              <NextLink href={{pathname: '/users/[userId]/builds', query: {userId}}} legacyBehavior passHref>
                <Link>{profile.builds.length}</Link>
              </NextLink>
            </VStack>
          </VStack>
        </VStack>
      </Flex>
      <Flex width="full">
        <VStack alignItems="start" spacing="4" flex="1">
          <Heading size="md">Profile</Heading>
          <Divider />
          {!authData || !editing ? (
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
                      href={`https://instagram.com/${profile.instagram_handle.replace(/^@/, '')}`}
                      target="_blank"
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
  )
}

ProfilePage.getLayout = (page: ReactElement<InferGetServerSidePropsType<typeof getServerSideProps>>) => {
  return (
    <UserLayout profile={page.props.profile} title="Profile">
      {page}
    </UserLayout>
  )
}

export default ProfilePage

type ProfilePageProps = {
  profile: Profile
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
