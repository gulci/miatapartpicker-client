import {env} from '~/env.mjs'

export const mppApiDefaultHeaders = {
  accept: 'application/json',
  'content-type': 'application/json',
  Authorization: `Bearer ${env.BACKEND_TOKEN}`,
}
