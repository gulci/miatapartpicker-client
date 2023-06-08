import {z} from 'zod'

export const UserSchema = z.object({
  avatar: z.string().nullable(),
  discriminator: z.string(),
  display_name: z.string(),
  id: z.string(),
  username: z.string(),
})
