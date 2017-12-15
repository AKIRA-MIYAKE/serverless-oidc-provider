/*
 * Using API Gateway and Lambda dynamically changes the directory path.
 * A helper method for getting those information.
 */
const getMountOption = event => {
  const resource = event.resource
  const appPath = `/${event.pathParameters.proxy}`
  const requestContextPath = event.requestContext.path

  // Directory specified by API Gateway setting.
  const internal = resource.split('/').slice(0, -1).join('/')
  // Directory that appears due to external factors, such as execute-api or custom domain path settings.
  const external = requestContextPath.substring(0, requestContextPath.length - (appPath.length + internal.length))

  const directory = external + internal

  // A value to overwrite the path from lambda so that it is the path assumed by app
  const rewriteEventPath = external + internal + appPath

  // If root of API Gateway and root of custom domain, mountOption does not exist.
  return (directory.length > 0) ? { directory, rewriteEventPath } : undefined
}

module.exports = {
  getMountOption
}
