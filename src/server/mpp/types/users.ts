import {z} from 'zod'

export const UserSchema = z.object({
  builds: z.array(z.string()),
  discord_user_id: z.number(),
  featured_build: z.string().nullable(),
  foot_size: z.number().nullable(),
  hand_size: z.number().nullable(),
  instagram_handle: z.string().nullable(),
  prefered_unit: z.string().nullable(),
  preferred_timezone: z.string().nullable(),
})
