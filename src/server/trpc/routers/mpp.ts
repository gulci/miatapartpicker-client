import {TRPCError} from '@trpc/server'
import {z} from 'zod'

import {getUserBuilds} from '~/server/mpp/builds'
import {updateUser} from '~/server/mpp/requests/users'
import {UserInputSchema} from '~/server/mpp/types/users'
import {getUserProfile} from '~/server/mpp/users'
import {createTRPCRouter, protectedProcedure, publicProcedure} from '~/server/trpc/trpc'

export const mppRouter = createTRPCRouter({
  getUserBuilds: publicProcedure.input(z.object({userId: z.string()})).query(async ({input}) => {
    const builds = await getUserBuilds(input.userId)
    if (!builds) throw new TRPCError({code: 'NOT_FOUND', message: 'user not found'})
    return builds
  }),
  getUserProfile: publicProcedure.input(z.object({userId: z.string()})).query(async ({input}) => {
    const profile = await getUserProfile(input.userId)
    if (!profile) throw new TRPCError({code: 'NOT_FOUND', message: 'user not found'})
    return profile
  }),
  protectedUpdateUserProfile: protectedProcedure.input(UserInputSchema).mutation(async ({input, ctx}) => {
    const updateRes = await updateUser(ctx.session.user.id, input)
    if (!updateRes.ok) {
      console.error('failed to update user;', updateRes.status, updateRes.statusText, await updateRes.text())
      throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'failed to update user'})
    }
  }),
})
