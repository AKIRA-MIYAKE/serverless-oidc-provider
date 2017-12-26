const { getToken } = require('./helpers/get-token')
const { generatePolicy } = require('./helpers/generate-policy')
const { introspect } = require('./introspection/introspect')

const authorizerHandler = async (event, context, callback) => {
  const token = getToken(event.authorizationToken)

  if (!token) {
    callback('Unauthorized')
  }

  const introspectionResult = await introspect(token)

  if (!introspectionResult.active) {
    callback('Unauthorized')
  }

  const { principalId, effect, resource, authContext } = await confirmPermission(introspectionResult, event.methodArn)

  const policy = generatePolicy(principalId, effect, resource, authContext)

  callback(undefined, policy)
}

/**
 * From the introspection result, confirm the authority to the access target.
 * If you are doing your own permission management, use this method to verify.
 */
const confirmPermission = async (introspectionResult, resource) => {
  // Currently it is an implementation that allows access if it is a valid token.
  return {
    principalId: (introspectionResult.sub) ? introspectionResult.sub : introspectionResult.client_id,
    effect: 'Allow',
    resource: resource,
    authContext: {
      // The value that can be set in the context is limited to the primitive value, so serialize it.
      introspection: JSON.stringify(introspectionResult)
    }
  }
}

module.exports = {
  authorizerHandler
}
