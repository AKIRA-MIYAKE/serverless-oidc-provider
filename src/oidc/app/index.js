const Provider = require('oidc-provider')

const generateApp = async settings => {
  const oidc = new Provider(settings.issure, settings.configuration)
  await oidc.initialize(settings.initialization)

  oidc.app.proxy = true
  oidc.app.keys = settings.secureKeys

  return oidc.app
}

module.exports = {
  generateApp
}
