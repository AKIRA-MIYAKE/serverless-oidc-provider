const Provider = require('oidc-provider')

/**
 * Function to set up oidc provider app.
 * @param { Object } settings - Values for setting and initializing Provider.
 */
const setupApp = async settings => {
  const oidc = new Provider(settings.issure, settings.configuration)

  await oidc.initialize(settings.initialization)
  oidc.app.proxy = true
  oidc.app.keys = settings.secureKeys

  // If devInteraction is invalid, add your own interaction to the provider's router.
  if (!settings.configuration.features.devInteractions) {
    const instance = require('oidc-provider/lib/helpers/weak_cache')
    const error = require('oidc-provider/lib/shared/error_handler')
    const { router } = instance(oidc)

    const getInteraction = require('./actions/interaction')
    const interaction = getInteraction(oidc)

    router.get('interaction', '/interaction/:grant', error(oidc), interaction.get)
    router.post('submit', '/interaction/:grant/submit', error(oidc), interaction.post)
  }

  return oidc.app
}

module.exports = {
  setupApp
}
