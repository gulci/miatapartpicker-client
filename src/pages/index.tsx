import {type GetServerSideProps} from 'next'
import {getServerSession} from 'next-auth'

import {authOptions} from '~/server/auth'

import {type AppPage} from './_app'

const HomePage: AppPage = () => null

HomePage.auth = true

export default HomePage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: `/users/${session.user.id}`,
        permanent: false,
      },
    }
  }

  return {props: {}}
}
