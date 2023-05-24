import fastify from 'fastify'
import 'dotenv/config'
import { twitchRoutes } from './routes/twitch'
import { appRoutes } from './routes/app'

const app = fastify()
const port = 3333

app.register(appRoutes)
app.register(twitchRoutes)

app.listen({ port }).then(() => {
  console.log(`💜 - HTTP Server Running on http://localhost:${port}`)
})
