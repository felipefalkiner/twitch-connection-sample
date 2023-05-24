import axios from 'axios'
import { prisma } from '../lib/prisma'

export async function refreshTokenFunction(userId: string) {
  const { refreshToken, twitchID } = await prisma.users.findUniqueOrThrow({
    where: {
      id: userId,
    },
  })

  const data = {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }

  const { data: refreshResponse } = await axios.post(
    'https://id.twitch.tv/oauth2/token',
    data,
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    },
  )

  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: refreshResponse.refresh_token,
      accessToken: refreshResponse.access_token,
      twitchID,
    },
  })

  return {
    refreshToken: refreshResponse.refresh_token,
    accessToken: refreshResponse.access_token,
    twitchID,
  }
}

export async function validateUserToken(userId: string) {
  const { accessToken, refreshToken, twitchID } =
    await prisma.users.findUniqueOrThrow({
      where: {
        id: userId,
      },
    })

  return await axios
    .get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID,
      },
    })
    .then(() => {
      return { accessToken, refreshToken, twitchID }
    })
    .catch((err) => {
      err = err.toJSON()
      return refreshTokenFunction(userId)
    })
}
