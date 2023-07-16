import {z} from 'zod'

export const BuildSchema = z.object({
  banner_photo_id: z.string().nullable(),
  coilovers: z.string().nullable(),
  color: z.string().nullable(),
  description: z.string().nullable(),
  make: z.string().nullable(),
  mileage: z.number().nullable(),
  model: z.string().nullable(),
  photos: z.array(
    z.object({
      meta: z.object({
        format: z.string(),
        width: z.number(),
        animated: z.boolean(),
        frame_count: z.number(),
        height: z.number(),
      }),
      filename: z.string(),
      uuid: z.string(),
    }),
  ),
  ride_height: z.number().nullable(),
  tires: z.string().nullable(),
  uid: z.string(),
  user_id: z.string(),
  vin: z.string().nullable(),
  wheels: z.string().nullable(),
  year: z.number().nullable(),
})
export type Build = z.infer<typeof BuildSchema>
