import {useState} from 'react'

import {type GetServerSideProps, type InferGetServerSidePropsType} from 'next'

import {
  AspectRatio,
  Center,
  Container,
  HStack,
  Heading,
  Image,
  Skeleton,
  Stack,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react'
import {IoChevronBackOutline, IoChevronForwardOutline} from 'react-icons/io5'

import {
  HoriCarousel,
  HoriCarouselIconButton,
  HoriCarouselSlide,
  useHoriCarousel,
} from '~/components/galleries/HoriCarousel'
import {env} from '~/env.mjs'
import MainLayout from '~/layouts/MainLayout'
import {getBuild} from '~/server/mpp/requests/builds'
import {type Build, BuildSchema} from '~/server/mpp/types/builds'

import {type AppPage} from '../_app'

const BuildPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({build}) => {
  const [index, setIndex] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const slidesPerView = useBreakpointValue({base: 3, md: 5})

  const [ref, slider] = useHoriCarousel({
    slides: {
      perView: slidesPerView,
      spacing: useBreakpointValue({base: 16, md: 24}),
    },
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
  })

  return (
    <>
      <Center _dark={{backgroundColor: 'blue.600'}} _light={{backgroundColor: 'blue.400'}} paddingY="8">
        <VStack spacing="4">
          <Heading
            _dark={{color: 'whiteAlpha.600'}}
            _light={{color: 'blackAlpha.600'}}
            size="sm"
            textTransform="uppercase"
          >
            Build
          </Heading>
          <Heading as="h1" color="white">
            {build.description || 'Untitled Build'}
          </Heading>
        </VStack>
      </Center>
      {build.photos.length > 0 && (
        <Container maxW="container.lg" paddingY="8">
          <Stack spacing="4">
            <AspectRatio ratio={16 / 9}>
              <Image
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                src={`${env.NEXT_PUBLIC_MPP_MEDIA_URL}/${build.photos[index]!.uuid}`}
                objectFit="cover"
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                alt={build.photos[index]!.filename}
                fallback={<Skeleton />}
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
                {build.photos.map((image, i) => (
                  <HoriCarouselSlide key={i} onClick={() => setIndex(i)} cursor="pointer">
                    <AspectRatio
                      ratio={16 / 9}
                      transition="all 200ms"
                      opacity={index === i ? 1 : 0.4}
                      _hover={{opacity: 1}}
                    >
                      <Image
                        src={`${env.NEXT_PUBLIC_MPP_MEDIA_URL}/${image.uuid}`}
                        objectFit="cover"
                        alt={image.filename}
                        fallback={<Skeleton />}
                      />
                    </AspectRatio>
                  </HoriCarouselSlide>
                ))}
              </HoriCarousel>
              <HoriCarouselIconButton
                onClick={() => slider.current?.next()}
                icon={<IoChevronForwardOutline />}
                aria-label="Next slide"
                disabled={currentSlide + Number(slidesPerView) === build.photos.length}
              />
            </HStack>
          </Stack>
        </Container>
      )}
    </>
  )
}

BuildPage.getLayout = (page) => {
  const {build} = page.props as InferGetServerSidePropsType<typeof getServerSideProps>
  return <MainLayout headProps={{title: build.description || 'MiataPartPicker'}}>{page}</MainLayout>
}

export default BuildPage

type BuildPageProps = {
  build: Build
}

export const getServerSideProps: GetServerSideProps<BuildPageProps, {buildId: string}> = async (ctx) => {
  if (!ctx.params) return {notFound: true}
  const buildRes = await getBuild(ctx.params.buildId)
  if (!buildRes.ok) {
    if (buildRes.status === 404) return {notFound: true}
    else throw new Error('failed to fetch build')
  }
  const build = BuildSchema.parse(await buildRes.json())
  return {props: {build}}
}
