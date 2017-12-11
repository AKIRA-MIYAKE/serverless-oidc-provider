const getMountOption = event => {
  const resource = event.resource
  const appPath = `/${event.pathParameters.proxy}`
  const requestContextPath = event.requestContext.path

  const internal = resource.split('/').slice(0, -1).join('/')
  const external = requestContextPath.substring(0, requestContextPath.length - (appPath.length + internal.length))

  const directory = external + internal
  const rewriteEventPath = external + internal + appPath

  return (directory.length > 0) ? { directory, rewriteEventPath } : undefined
}

module.exports = {
  getMountOption
}
