const url = require('url')

const { DynamoDB } = require('aws-sdk')

const Adapter = require('oidc-provider-dynamodb-adapter/fallback')
const Account = require('./account')
const keystore = require('./keystore/keystore.json')

Adapter.setConfig({
  // When running on lambda, parameters are unnecessary because using environment variables.
  dynamoDB: new DynamoDB(),
  tableName: process.env.AWS_DYNAMODB_TABLE_NAME
})

const settings = {
  issure: process.env.OIDC_ISSURE,
  secureKeys: process.env.SECURE_KEYS.split(','),
  configuration: {
    findById: Account.findById,
    // Cognito supports OpenID Connect standard climb by default.
    claims: {
      address: ['address'],
      email: ['email', 'email_verified'],
      phone: ['phone_number', 'phone_number_verified'],
      profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name', 'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo']
    },
    features: {
      devInteractions: false,
      discovery: true,
      requestUri: true,
      oauthNativeApps: true,
      pkce: true,

      backchannelLogout: false,
      claimsParameter: true,
      clientCredentials: true,
      encryption: false,
      introspection: true,
      alwaysIssueRefresh: false,
      registration: false,
      registrationManagement: false,
      request: false,
      revocation: true,
      sessionManagement: false
    }
  },
  initialization: {
    keystore: keystore,
    clients: [{
      client_id: '348bf290-b0b5-4e8c-8df6-8f862fa11363',
      client_secret: '2LRQOccHgaUUsDsnjb4ZeU6FLsMS1agPJJNt13llXTHHD1gaVqeehR4JJhZQSo6nF9HUc6a58Urm04GR5VIY0b',
      response_types: ['none', 'id_token', 'id_token token', 'code', 'code token', 'code id_token', 'code id_token token'],
      grant_types: ['authorization_code', 'implicit', 'refresh_token', 'client_credentials'],
      redirect_uris: ['https://example.com'],
      application_type: 'web',
      client_name: 'Example',
      client_uri: 'https://example.com',
      logo_uri: 'https://avatars3.githubusercontent.com/u/2390987'
    }],
    adapter: Adapter
  }
}

module.exports = settings
