const serverlessHttp = require('serverless-http')

const { setupApp } = require('./setup-app')
const { getMountOption } = require('./helpers/get-mount-option')
const defaultSettings = require('./settings')

/**
 * A function for handling requests within the handler of lambda.
 * @param { Object } event - Event passed from API Gateway.
 * @param { Object } context - Lambda context.
 * @param { Function } callback - Lambda callback.
 * @param { ?Object } settings - Values for setting and initializing Provider.
 */
const handleRequest = async (event, context, callback, settings = defaultSettings) => {
  const app = await setupApp(settings)
  const mountOption = getMountOption(event)

  let koaApp
  if (!mountOption) {
    const logger = require('koa-logger')

    koaApp = app
    koaApp.use(logger())
  } else {
    // If mountOption exists, mount the application in the directory and rewrite the event path in order to properly perform processing such as redirect.
    const Koa = require('koa')
    const logger = require('koa-logger')
    const mount = require('koa-mount')

    koaApp = new Koa()
    koaApp.proxy = true
    koaApp.keys = settings.secureKeys
    koaApp.use(logger())
    koaApp.use(mount(mountOption.directory, app))

    event.path = mountOption.rewriteEventPath
  }

  serverlessHttp(koaApp)(event, context, callback)
}

module.exports = { handleRequest }
