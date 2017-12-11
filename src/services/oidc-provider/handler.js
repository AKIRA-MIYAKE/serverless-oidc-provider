const { handleRequest } = require('../../oidc')
const settings = require('../../app/oidc/settings')

module.exports.oidc = (event, context, callback) => handleRequest(event, context, callback, settings)
