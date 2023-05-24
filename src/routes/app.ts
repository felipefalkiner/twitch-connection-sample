import { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  app.get('/twitchAuthURL', async (request) => {
    const preURL = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.TWITCH_REDIRECT_URI}&scope=`
    const scopes = process.env.TWITCH_SCOPES?.replaceAll(':', '%3A').replaceAll(
      ',',
      '+',
    )

    return { url: preURL.concat(`${scopes}`) }
  })
}
