const serverlessHttp = require('serverless-http')

const { generateApp } = require('./app')
const defaultSettings = require('./settings')

const handleRequest = (event, context, callback, settings = defaultSettings) => {
  generateApp(settings)
  .then(app => {
    const mountOption = getMountOption(event)

    let koaApp
    if (!mountOption) {
      koaApp = app
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

const getMountOption = event => {
  const resource = event.resource
  const appPath = `/${event.pathParameters.proxy}`
  const requestContextPath = event.requestContext.path

  const internal = resource.split('/').slice(0, -1).join('/')
  const external = requestContextPath.substring(0, requestContextPath.length - appPath.length)

  const directory = external + internal
  const rewriteEventPath = external + internal + appPath

  return (directory.length > 0) ? { directory, rewriteEventPath } : undefined
}

module.exports = { handleRequest }
