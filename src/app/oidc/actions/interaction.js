const url = require('url')

const compose = require('koa-compose')
const bodyParser = require('oidc-provider/lib/shared/selective_body')
const instance = require('oidc-provider/lib/helpers/weak_cache')
const createHttpError = require('http-errors')

const views = require('../views')
const Account = require('../account')

const parseBody = bodyParser('application/x-www-form-urlencoded')

module.exports = provider => {
  // Dynamic mounting is supported using a function similar to devInteraction.
  instance(provider).configuration().interactionUrl = async ctx => {
    return url.parse(ctx.oidc.urlFor('interaction', { grant: ctx.oidc.uuid })).pathname
  }

  return {
    get: compose([
      async (ctx, next) => {
        ctx.oidc.uuid = ctx.params.grant
        const details = await provider.interactionDetails(ctx.req)
        const client = await provider.Client.find(details.params.client_id)
        ctx.assert(client, 400)

        const action = url.parse(ctx.oidc.urlFor('submit', { grant: details.uuid })).pathname
        const view = (() => {
          switch (details.interaction.reason) {
            case 'consent_prompt':
            case 'client_not_authorized':
            case 'native_client_prompt':
              return 'interaction'
            default:
              return 'login'
          }
        })()

        // Retrieve code from query string to display authentication error.
        const error = (ctx.request.query) ? ctx.request.query.error : undefined

        const locals = {
          action,
          client,
          error,
          returnTo: details.returnTo,
          params: details.params
        };
        locals.body = views[view](locals)

        ctx.type = 'html'
        ctx.body = views.layout(locals)

        await next()
      }
    ]),
    post: compose([
      parseBody,
      Account.signInErrorHandler,
      async (ctx, next) => {
        ctx.oidc.uuid = ctx.params.grant
        const details = await provider.interactionDetails(ctx.req)

        switch (ctx.oidc.body.view) {
          case 'login':
            const params = {
              username: ctx.oidc.body.username,
              password: ctx.oidc.body.password
            }

            const data = await Account.signIn(params)
            const remember = !!ctx.oidc.body.remember

            // If the user does not continue logging in, remove offline_access from the scope even if it is included in the request.
            const scope = (remember) ?
              details.params.scope :
              details.params.scope.split(' ')
              .filter(v => (v !== 'offline_access'))
              .join(' ')

            await provider.interactionFinished(ctx.req, ctx.res, {
              login: {
                account: data.sub,
                acr: '1',
                remember: remember,
                ts: Math.floor(Date.now() / 1000),
              },
              consent: { scope },
              meta: {
                cognito: data.raw
              }
            });
            break;
          case 'interaction':
            await provider.interactionFinished(ctx.req, ctx.res, { consent: {} })
            break;
        }

        await next()
      }
    ])
  }
}
