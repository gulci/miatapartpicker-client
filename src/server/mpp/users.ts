import {env} from '~/env.mjs'
import {getUser as getDiscordUser} from '~/server/discord/requests/users'
import {UserSchema as DiscordUserSchema} from '~/server/discord/types/users'
import {getUser as getMPPUser} from '~/server/mpp/requests/users'
import {UserSchema as MPPUserSchema} from '~/server/mpp/types/users'

export async function getUserProfile(userId: string) {
  const discordUserRes = await getDiscordUser(userId)
  if (!discordUserRes.ok) {
    if (discordUserRes.status === 404) return null
    else throw new Error('failed to fetch user from discord')
  }
  const discordUser = DiscordUserSchema.parse(await discordUserRes.json())
  const mppUserRes = await getMPPUser(userId)
  if (!mppUserRes.ok) {
    if (mppUserRes.status === 404) return null
    else throw new Error('failed to fetch user from mpp')
  }
  const mppUser = MPPUserSchema.parse(await mppUserRes.json())

  let avatarUrl = `${env.NEXT_PUBLIC_DISCORD_CDN_ENDPOINT_URL}/embed/avatars/${
    Number(discordUser.discriminator) % 5
  }.png`
  if (discordUser.avatar)
    avatarUrl = `${env.NEXT_PUBLIC_DISCORD_CDN_ENDPOINT_URL}/avatars/${discordUser.id}/${discordUser.avatar}.png`

  return {
    avatarUrl,
    builds: mppUser.builds,
    discriminator: discordUser.discriminator,
    displayName: discordUser.display_name,
    foot_size: mppUser.foot_size,
    hand_size: mppUser.hand_size,
    instagram_handle: mppUser.instagram_handle,
    preferred_timezone: mppUser.preferred_timezone,
    preferred_unit: mppUser.prefered_unit,
    username: discordUser.username,
  }
}
