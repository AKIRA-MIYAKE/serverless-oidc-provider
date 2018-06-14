const { handleRequest } = require('../../app/oidc')

module.exports.oidc = async (event, context, callback) => await handleRequest(event, context, callback)
