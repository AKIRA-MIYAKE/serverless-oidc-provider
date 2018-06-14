const url = require('url')

const { CognitoIdentityServiceProvider } = require('aws-sdk')
const jwt = require('jsonwebtoken')

let sharedConfig = {
  cognitoIdentityServiceProvider: new CognitoIdentityServiceProvider(),
  clientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID,
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID
}

const setConfig = (config = {}) => {
  sharedConfig = Object.assign({}, sharedConfig, config)
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
      .then(() => new Promise((resolve, reject) => {
        // Try to log in as administrator using parameters passed from user.
        sharedConfig.cognitoIdentityServiceProvider.adminInitiateAuth({
          AuthFlow: 'ADMIN_NO_SRP_AUTH',
          ClientId: sharedConfig.clientId,
          UserPoolId: sharedConfig.userPoolId,
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
      }))
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
      const redirectUrl = url.parse(ctx.oidc.urlFor('interaction', { grant: ctx.oidc.uuid })).pathname

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
      .then(() => new Promise((resolve, reject) => {
        sharedConfig.cognitoIdentityServiceProvider.listUsers({
          UserPoolId: sharedConfig.userPoolId,
          Filter: `sub = "${id}"`,
          Limit: 1
        }, (error, results) => {
          if (error || results.Users.length === 0) {
            reject((error) ? error : new Error())
            return
          }
          resolve(results.Users[0])
        })
      }))
      .then(data => {
        // Return the value of Cognito's UserAttributes as climes.
        const claims = async () => data.Attributes.reduce((acc, current) => {
          acc[current.Name] = current.Value
          return acc
        }, {})
        return new Account(id, claims)
      })
  }

  constructor(id, claims) {
    this.accountId = id
    this.claims = claims
  }
}

module.exports = Account
