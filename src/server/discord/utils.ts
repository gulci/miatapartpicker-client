import {env} from '~/env.mjs'

export const discordApiDefaultHeaders = {
  accept: 'application/json',
  'content-type': 'application/json',
  Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
}
