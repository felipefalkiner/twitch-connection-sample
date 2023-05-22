import fastify from 'fastify'
import 'dotenv/config'

const app = fastify()
const port = 3333

app.listen({ port }).then(() => {
  console.log(`💜 - HTTP Server Running on http://localhost:${port}`)
})
