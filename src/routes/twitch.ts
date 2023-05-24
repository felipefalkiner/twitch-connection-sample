import { FastifyInstance } from 'fastify'
import axios from 'axios'
import { prisma } from '../lib/prisma'
import { refreshToken } from '../lib/twitch'

export async function twitchRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const { code } = request.body
    const client_id = process.env.TWITCH_CLIENT_ID

    const postData = {
      client_id,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TWITCH_REDIRECT_URI,
    }

    const twitchTokens = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      postData,
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    )

    const { access_token, refresh_token } = twitchTokens.data

    const { data: userResponse } = await axios.get(
      'https://api.twitch.tv/helix/users',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Client-Id': client_id,
        },
      },
    )

    const [userData] = userResponse.data

    const twitchID = userData.id
    const twitchLogin = userData.login
    const twitchProfileImg = userData.profile_image_url

    const { data: followersResponse } = await axios.get(
      'https://api.twitch.tv/helix/channels/followers',
      {
        params: {
          broadcaster_id: twitchID,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Client-Id': client_id,
        },
      },
    )

    let user = await prisma.users.findUnique({
      where: {
        twitchID,
      },
    })

    if (!user) {
      user = await prisma.users.create({
        data: {
          twitchID,
          twitchLogin,
          twitchProfileImg,
          followers: followersResponse.total,
          accessToken: access_token,
          refreshToken: refresh_token,
        },
      })
    }
  })
}
