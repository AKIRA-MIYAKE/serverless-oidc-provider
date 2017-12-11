const serverlessHttp = require('serverless-http')
const Provider = require('oidc-provider')

const { getMountOption } = require('./helpers/get-mount-option')
const defaultSettings = require('./settings')

const handleRequest = (event, context, callback, settings = defaultSettings) => {
  const oidc = new Provider(settings.issure, settings.configuration)

  oidc.initialize(settings.initialization)
  .then(() => {
    oidc.app.proxy = true
    oidc.app.keys = settings.secureKeys

    return oidc.app
  })
  .then(app => {
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
  })
  .catch(error => callback(error))
}

module.exports = { handleRequest }
