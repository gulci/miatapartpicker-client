import {env} from '~/env.mjs'
import {type UserInput} from '~/server/mpp/types/users'
import {mppApiDefaultHeaders} from '~/server/mpp/utils'

export async function getUser(userId: string) {
  return await fetch(`${env.BACKEND_ENDPOINT_URL}/users/${userId}`, {
    headers: mppApiDefaultHeaders,
  })
}

export async function updateUser(userId: string, data: UserInput) {
  return await fetch(`${env.BACKEND_ENDPOINT_URL}/users/${userId}`, {
    body: JSON.stringify(data),
    headers: mppApiDefaultHeaders,
    method: 'PUT',
  })
}
