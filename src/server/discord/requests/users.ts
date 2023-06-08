import {env} from '~/env.mjs'

import {discordApiDefaultHeaders} from '../utils'

export async function getUser(userId: string) {
  return await fetch(`${env.DISCORD_API_ENDPOINT_URL}/users/${userId}`, {
    headers: discordApiDefaultHeaders,
  })
}
