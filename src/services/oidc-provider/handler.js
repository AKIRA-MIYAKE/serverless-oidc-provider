const { handleRequest } = require('../../app/oidc')

module.exports.oidc = (event, context, callback) => handleRequest(event, context, callback)
