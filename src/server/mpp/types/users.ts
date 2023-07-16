import {z} from 'zod'

export const ProfileSchema = z.object({
  avatarUrl: z.string(),
  builds: z.array(z.string()),
  discriminator: z.string(),
  displayName: z.string(),
  foot_size: z.number().nullable(),
  hand_size: z.number().nullable(),
  instagram_handle: z.string().nullable(),
  preferred_timezone: z.string().nullable(),
  preferred_unit: z.string().nullable(),
  username: z.string(),
})
export type Profile = z.infer<typeof ProfileSchema>

export const UserSchema = z.object({
  builds: z.array(z.string()),
  discord_user_id: z.string(),
  featured_build: z.string().nullable(),
  foot_size: z.number().nullable(),
  hand_size: z.number().nullable(),
  instagram_handle: z.string().nullable(),
  prefered_unit: z.string().nullable(),
  preferred_timezone: z.string().nullable(),
})

export const UserInputSchema = UserSchema.pick({
  instagram_handle: true,
  prefered_unit: true,
  preferred_timezone: true,
}).extend({
  foot_size: z.string().nullable(),
  hand_size: z.string().nullable(),
})
export type UserInput = z.infer<typeof UserInputSchema>
