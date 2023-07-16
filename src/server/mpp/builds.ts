import {getBuild as getBuildReq, getUserBuilds as getUserBuildsReq} from './requests/builds'
import {BuildSchema} from './types/builds'

export async function getBuild(buildId: string) {
  const buildRes = await getBuildReq(buildId)
  if (!buildRes.ok) {
    if (buildRes.status === 404) return null
    throw new Error('failed to fetch build from mpp')
  }
  return BuildSchema.parse(await buildRes.json())
}

export async function getUserBuilds(userId: string) {
  const buildRes = await getUserBuildsReq(userId)
  if (!buildRes.ok) {
    if (buildRes.status === 404) return null
    throw new Error('failed to fetch build from mpp')
  }
  return BuildSchema.array().parse(await buildRes.json())
}
