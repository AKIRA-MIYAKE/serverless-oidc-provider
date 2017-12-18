const url = require('url')

const { CognitoIdentityServiceProvider } = require('aws-sdk')
const jwt = require('jsonwebtoken')

let _config = {
  cognitoIdentityServiceProvider: new CognitoIdentityServiceProvider(),
  clientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID,
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID
}

const setConfig = (config = {}) => {
  _config = Object.assign({}, _config, config)
}

/**
 * Account class corresponding to the interface of findById().
 */
class Account {

  static setConfig(config) {
    setConfig(config)
  }

  static async signIn(params) {
    return Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        // Try to log in as administrator using parameters passed from user.
        _config.cognitoIdentityServiceProvider.adminInitiateAuth({
          AuthFlow: 'ADMIN_NO_SRP_AUTH',
          ClientId: _config.clientId,
          UserPoolId: _config.userPoolId,
          AuthParameters: {
            USERNAME: params.username,
            PASSWORD: params.password
          }
        }, (error, data) => {
          if (error) {
            reject(error)
            return
          }
          resolve(data)
        })
      })
    })
    .then(data => {
      // Decode Cognito's id token and get user's sub.
      const idToken = jwt.decode(data.AuthenticationResult.IdToken)
      return {
        sub: idToken.sub,
        raw: data
      }
    })
  }

  static async signInErrorHandler(ctx, next) {
    try {
      await next()
    } catch (error) {
      let redirectUrl = url.parse(ctx.oidc.urlFor('interaction', { grant: ctx.oidc.uuid })).pathname

      switch (error.code) {
        case 'NotAuthorizedException':
        case 'UserNotFoundException':
          // Even if the user does not exist, return NotAuthorizedException.
          ctx.redirect(`${redirectUrl}?error=NotAuthorizedException`)
          break
        case 'PasswordResetRequiredException':
        case 'UserNotConfirmedException':
          ctx.redirect(`${redirectUrl}?error=${error.code}`)
          break
        default:
          ctx.throw(500, 'server_error', { error_description: error.message })
          break
      }
    }
  }

  static async findById(ctx, id) {
    return Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        _config.cognitoIdentityServiceProvider.adminGetUser({
          UserPoolId: _config.userPoolId,
          Username: id
        }, (error, data) => {
          if (error) {
            reject(error)
            return
          }
          resolve(data)
        })
      })
    })
    .then(data => {
      const claims = async () => {
        // Return the value of Cognito's UserAttributes as climes.
        return data.UserAttributes.reduce((acc, current) => {
          acc[current.Name] = current.Value
          return acc
        }, {})
      }
      return new Account(data.Username, claims)
    })
  }

  constructor(id, claims) {
    this.accountId = id
    this.claims = claims
  }

}

module.exports = Account
