import {type ReactElement, useState} from 'react'

import {type GetServerSideProps, type InferGetServerSidePropsType} from 'next'
import Image from 'next/image'
import NextLink from 'next/link'
import {useRouter} from 'next/router'

import {AspectRatio, Center, Divider, Flex, Heading, Link, List, ListItem, Stack, Text, VStack} from '@chakra-ui/react'

import {env} from '~/env.mjs'
import {UserLayout} from '~/layouts/UserLayout'
import {type AppPage} from '~/pages/_app'
import {getUserBuilds} from '~/server/mpp/builds'
import {type Build} from '~/server/mpp/types/builds'
import {type Profile} from '~/server/mpp/types/users'
import {getUserProfile} from '~/server/mpp/users'
import {trpc} from '~/utils/trpc'

const BuildsPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({builds: ssrBuilds}) => {
  const {
    query: {userId},
  } = useRouter()
  const {data: builds} = trpc.mpp.getUserBuilds.useQuery({userId: userId as string}, {initialData: ssrBuilds})
  const [selectedBuildUid, setSelectedBuildUid] = useState<string | null>(
    builds.length > 0 && builds[0] ? builds[0].uid : null,
  )
  const selectedBuild = builds.find((b) => b.uid === selectedBuildUid)
  const selectedBuildBannerPhoto = selectedBuild?.photos.find((p) => selectedBuild.banner_photo_id === p.uuid)

  return (
    <Stack direction={{base: 'column', lg: 'row'}} flex="1" height="200" spacing={{base: '12', lg: '16'}}>
      <Flex maxWidth={{lg: '72'}} width="full">
        <VStack alignItems="start" spacing="4" flex="1">
          <Heading size="md">Account</Heading>
          <Divider />
          <VStack alignItems="start" spacing="4" width="full">
            <VStack alignItems="start" spacing="1" width="full">
              <Text as="b">Builds</Text>
              <List width="full">
                {builds.map((build) => (
                  <ListItem
                    _dark={{backgroundColor: build.uid === selectedBuildUid ? 'gray.600' : 'gray.700'}}
                    _light={{backgroundColor: build.uid === selectedBuildUid ? 'gray.200' : 'gray.100'}}
                    _hover={{
                      _dark: {backgroundColor: 'gray.600'},
                      _light: {backgroundColor: 'gray.200'},
                    }}
                    cursor="pointer"
                    key={build.uid}
                    onClick={() => {
                      const b = builds.find((b) => b.uid === build.uid)
                      b && setSelectedBuildUid(b.uid)
                    }}
                    padding="2"
                    role="button"
                  >
                    <Text as="b" fontSize="sm">
                      {build.description || 'Untitled Build'}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </VStack>
          </VStack>
        </VStack>
      </Flex>
      <Flex flex="1">
        {selectedBuild && (
          <VStack alignItems="start" spacing="4" flex="1">
            <Center width="full">
              <NextLink
                href={{
                  pathname: '/car/[buildId]',
                  query: {buildId: selectedBuild.uid},
                }}
                legacyBehavior
                passHref
              >
                <Link>
                  <Heading size="lg" textAlign="center">
                    {selectedBuild.description || 'Untitled Build'}
                  </Heading>
                </Link>
              </NextLink>
            </Center>
            {selectedBuildBannerPhoto && (
              <AspectRatio ratio={16 / 9} width="full">
                <Image
                  alt={selectedBuildBannerPhoto.filename}
                  height={selectedBuildBannerPhoto.meta.height}
                  priority={builds[0] && builds[0].uid === selectedBuildUid}
                  src={`${env.NEXT_PUBLIC_MPP_MEDIA_URL}/${selectedBuildBannerPhoto.uuid}`}
                  style={{objectFit: 'cover'}}
                  width={selectedBuildBannerPhoto.meta.width}
                />
              </AspectRatio>
            )}
          </VStack>
        )}
      </Flex>
    </Stack>
  )
}

BuildsPage.getLayout = (page: ReactElement<InferGetServerSidePropsType<typeof getServerSideProps>>) => {
  return (
    <UserLayout profile={page.props.profile} title="Builds">
      {page}
    </UserLayout>
  )
}

export default BuildsPage

type BuildsPageProps = {
  profile: Profile
  builds: Build[]
}

export const getServerSideProps: GetServerSideProps<BuildsPageProps, {userId: string}> = async (ctx) => {
  if (!ctx.params) return {notFound: true}
  const profile = await getUserProfile(ctx.params.userId)
  if (!profile) return {notFound: true}
  const builds = await getUserBuilds(ctx.params.userId)
  if (!builds) return {notFound: true}
  return {
    props: {
      builds,
      profile,
    },
  }
}
