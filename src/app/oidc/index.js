const serverlessHttp = require('serverless-http')

const { getOIDCApp } = require('./get-oidc-app')
const { getMountOption } = require('./helpers/get-mount-option')
const defaultSettings = require('./settings')

const handleRequest = async (event, context, callback, settings = defaultSettings) => {
  const app = await getOIDCApp(settings)
  const mountOption = getMountOption(event)

  let koaApp
  if (!mountOption) {
    const logger = require('koa-logger')

    koaApp = app
    koaApp.use(logger())
  } else {
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
