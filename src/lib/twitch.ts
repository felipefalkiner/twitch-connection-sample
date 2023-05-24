import axios from 'axios'

export async function refreshToken(userId: string, refreshToken: string) {
  const data = {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: 'refresh_token',
    redirect_uri: refreshToken,
  }

  const refreshResponse = await axios.post(
    'https://id.twitch.tv/oauth2/token',
    data,
    {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    },
  )

  return refreshResponse
}
