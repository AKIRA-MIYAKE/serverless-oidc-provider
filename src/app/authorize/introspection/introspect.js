const request = require('request-promise-native')

const introspect = async token => request({
  method: 'POST',
  uri: process.env.AWS_CUSTOM_AUTHORIZER_INTROSPECTION_ENDPOINT,
  form: { token },
  auth: {
    user: process.env.AWS_CUSTOM_AUTHORIZER_CLIENT_ID,
    pass: process.env.AWS_CUSTOM_AUTHORIZER_CLIENT_SECRET
  },
  transform: body => JSON.parse(body)
})

module.exports = {
  introspect
}
