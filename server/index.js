require('dotenv').config()
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config.js')
const app = require('./controllers/express')
const models = require('./models/primary')
config.dev = process.env.NODE_ENV !== 'production'
async function start() {
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(nuxt.render)
  models.sequelize
    .sync()
    .catch((err) => {
      console.error(err)
    })
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
