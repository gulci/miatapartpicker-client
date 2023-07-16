import {type ReactElement, useState} from 'react'

import {type GetServerSideProps, type InferGetServerSidePropsType} from 'next'
import Image from 'next/image'
import NextLink from 'next/link'
import {useRouter} from 'next/router'

import {
  AspectRatio,
  Avatar,
  Container,
  HStack,
  Heading,
  Skeleton,
  SkeletonCircle,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react'
import {IoChevronBackOutline, IoChevronForwardOutline} from 'react-icons/io5'

import {
  HoriCarousel,
  HoriCarouselIconButton,
  HoriCarouselSlide,
  useHoriCarousel,
} from '~/components/galleries/HoriCarousel'
import {Banner} from '~/components/ui/Banner'
import {env} from '~/env.mjs'
import {MainLayout} from '~/layouts/MainLayout'
import {type AppPage} from '~/pages/_app'
import {getBuild} from '~/server/mpp/builds'
import {type Build} from '~/server/mpp/types/builds'
import {trpc} from '~/utils/trpc'

const BuildPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({build: ssrBuild}) => {
  const slidesPerView = useBreakpointValue({base: 3, lg: 5})
  const {
    query: {buildId},
  } = useRouter()
  const {data: build} = trpc.mpp.getBuild.useQuery({buildId: buildId as string}, {initialData: ssrBuild})
  const {data: profile, fetchStatus: profileFetchStatus} = trpc.mpp.getUserProfile.useQuery({userId: build.user_id})
  const [currentSlide, setCurrentSlide] = useState(0)
  const [index, setIndex] = useState(0)

  const [ref, slider] = useHoriCarousel({
    slides: {
      perView: slidesPerView,
      spacing: useBreakpointValue({base: 16, lg: 24}),
    },
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
  })
  const sortedBuildPhotos = build.photos.sort((a, b) =>
    a.uuid === build.banner_photo_id ? -1 : b.uuid === build.banner_photo_id ? 1 : 0,
  )
  const currentBuildPhoto = sortedBuildPhotos[index]

  return (
    <>
      <Banner _dark={{backgroundColor: 'blue.600'}} _light={{backgroundColor: 'blue.400'}}>
        <Heading
          _dark={{color: 'whiteAlpha.600'}}
          _light={{color: 'blackAlpha.600'}}
          size="sm"
          textTransform="uppercase"
        >
          Build
        </Heading>
        <Heading as="h1" color="white" textAlign="center">
          {build.description || 'Untitled Build'}
        </Heading>
        <HStack spacing="2" alignItems="center">
          {!profile ? (
            profileFetchStatus === 'fetching' && (
              <>
                <Skeleton height="4" width="8" />
                <SkeletonCircle size="48px" />
                <Skeleton height="4" width="24" />
              </>
            )
          ) : (
            <>
              <Heading _dark={{color: 'whiteAlpha.600'}} _light={{color: 'blackAlpha.600'}} size="sm">
                by
              </Heading>
              <NextLink href={{pathname: '/users/[userId]', query: {userId: build.user_id}}}>
                <HStack
                  spacing="2"
                  title={`${profile.username}${profile.discriminator !== '0' ? `#${profile.discriminator}` : ''}`}
                >
                  <Avatar size="md" name={profile.displayName} src={profile.avatarUrl} />
                  <Heading _hover={{textDecoration: 'underline'}} color="whiteAlpha.700" size="md">
                    {profile.displayName}
                  </Heading>
                </HStack>
              </NextLink>
            </>
          )}
        </HStack>
      </Banner>
      {sortedBuildPhotos.length > 0 && currentBuildPhoto && (
        <Container maxWidth="container.lg" paddingY="8">
          <Stack spacing="4">
            <AspectRatio ratio={16 / 9}>
              <Image
                alt={currentBuildPhoto.filename}
                height={currentBuildPhoto.meta.height}
                priority
                src={`${env.NEXT_PUBLIC_MPP_MEDIA_URL}/${currentBuildPhoto.uuid}`}
                style={{objectFit: 'cover'}}
                width={currentBuildPhoto.meta.width}
              />
            </AspectRatio>
            <HStack spacing="4">
              <HoriCarouselIconButton
                onClick={() => slider.current?.prev()}
                icon={<IoChevronBackOutline />}
                aria-label="Previous slide"
                disabled={currentSlide === 0}
              />
              <HoriCarousel ref={ref} direction="row" width="full">
                {sortedBuildPhotos.map((image, i) => (
                  <HoriCarouselSlide key={i} onClick={() => setIndex(i)} cursor="pointer">
                    <AspectRatio
                      ratio={16 / 9}
                      transition="all 200ms"
                      opacity={index === i ? 1 : 0.4}
                      _hover={{opacity: 1}}
                    >
                      <Image
                        alt={image.filename}
                        height={image.meta.height}
                        src={`${env.NEXT_PUBLIC_MPP_MEDIA_URL}/${image.uuid}`}
                        style={{objectFit: 'cover'}}
                        width={image.meta.width}
                      />
                    </AspectRatio>
                  </HoriCarouselSlide>
                ))}
              </HoriCarousel>
              <HoriCarouselIconButton
                onClick={() => slider.current?.next()}
                icon={<IoChevronForwardOutline />}
                aria-label="Next slide"
                disabled={currentSlide + Number(slidesPerView) === sortedBuildPhotos.length}
              />
            </HStack>
          </Stack>
        </Container>
      )}
    </>
  )
}

BuildPage.getLayout = (page: ReactElement<InferGetServerSidePropsType<typeof getServerSideProps>>) => {
  return (
    <MainLayout
      headProps={{title: page.props.build.description || 'MiataPartPicker'}}
      navProps={{disableMargins: true}}
    >
      {page}
    </MainLayout>
  )
}

export default BuildPage

type BuildPageProps = {
  build: Build
}

export const getServerSideProps: GetServerSideProps<BuildPageProps, {buildId: string}> = async (ctx) => {
  if (!ctx.params) return {notFound: true}
  const build = await getBuild(ctx.params.buildId)
  if (!build) return {notFound: true}
  return {props: {build}}
}
