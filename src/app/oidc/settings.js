const { DynamoDB } = require('aws-sdk')

const Adapter = require('oidc-provider-dynamodb-adapter/fallback')
const keystore = require('./keystore/keystore.json')

Adapter.setConfig({
  dynamoDB: new DynamoDB(),
  tableName: (process.env.OIDC_DYNAMODB_TABLE_NAME) ? process.env.OIDC_DYNAMODB_TABLE_NAME : 'serverless-oidc-provider'
})

const settings = {
  issure: (process.env.OIDC_ISSURE) ? process.env.OIDC_ISSURE : 'https://oidc.example.com',
  secureKeys: (process.env.SECURE_KEYS) ? process.env.SECURE_KEYS.split(',') : ['Fq9AHpAbNYI0RxtYOfETS8nh11YY6n4Dym7XTYu0w0fWIOFH9c','4NupYHKAUi0nXaHRekN1lwmHtFNiNqOA6nw9goa1SPkXX7WR5l'],
  configuration: {
    features: {
      devInteractions: (process.env.ENV === 'prod') ? false : true,
      discovery: true,
      requestUri: true,
      oauthNativeApps: true,
      pkce: true,

      backchannelLogout: false,
      claimsParameter: false,
      clientCredentials: false,
      encryption: false,
      introspection: true,
      alwaysIssueRefresh: true,
      registration: true,
      registrationManagement: true,
      request: false,
      revocation: true,
      sessionManagement: true
    }
  },
  initialization: {
    keystore: (keystore) ? keystore : { keys: [] },
    clients: [{
      client_id: 'foo',
      client_secret: 'bar',
      response_types: ['code'],
      grant_types: ['authorization_code', 'refresh_token'],
      redirect_uris: ['https://example.com']
    }],
    adapter: Adapter
  }
}

module.exports = settings
