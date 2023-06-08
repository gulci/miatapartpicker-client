import {env} from '~/env.mjs'

import {mppApiDefaultHeaders} from '../utils'

export async function getUser(userId: string) {
  return await fetch(`${env.BACKEND_ENDPOINT_URL}/users/${userId}`, {
    headers: mppApiDefaultHeaders,
  })
}
