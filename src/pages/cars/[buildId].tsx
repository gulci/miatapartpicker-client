import {type GetServerSideProps, type InferGetServerSidePropsType} from 'next'

import {Center, Heading, VStack} from '@chakra-ui/react'

import MainLayout from '~/layouts/MainLayout'
import {getBuild} from '~/server/mpp/requests/builds'
import {type Build, BuildSchema} from '~/server/mpp/types/builds'

import {type AppPage} from '../_app'

const BuildPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({build}) => {
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
