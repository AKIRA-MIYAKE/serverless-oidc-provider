const { generateDummyAPIGatewayEvent } = require('lamprox')

const { getMountOption } = require('../../../../src/app/oidc/helpers/get-mount-option')

describe('app/oidc/helpers/get-mount-option', () => {

  describe('getMountOption()', () => {

    describe('when provided root dir.', () => {

      describe('invoke with api gateway custom domain that mapped on root dir.', () => {

        it('return undefined.', () => {
          const event = generateDummyAPIGatewayEvent({
            resource: '/{proxy+}',
            pathParameters: {
              proxy: '.well-known/openid-configuration'
            },
            requestContext: {
              path: '/.well-known/openid-configuration'
            }
          })

          expect(getMountOption(event)).toBeUndefined()
        })

      })

      describe('invoke with api gateway custom domain that mapped on child dir.', () => {

        it('return mount option.', () => {
          const event = generateDummyAPIGatewayEvent({
            resource: '/{proxy+}',
            pathParameters: {
              proxy: '.well-known/openid-configuration'
            },
            requestContext: {
              path: '/oidc/.well-known/openid-configuration'
            }
          })

          expect(getMountOption(event)).toEqual({
            directory: '/oidc',
            rewriteEventPath: '/oidc/.well-known/openid-configuration'
          })
        })

      })

      describe('invoke with execute-api endpoint.', () => {

        it('return mount option.', () => {
          const event = generateDummyAPIGatewayEvent({
            resource: '/{proxy+}',
            pathParameters: {
              proxy: '.well-known/openid-configuration'
            },
            requestContext: {
              path: '/dev/.well-known/openid-configuration'
            }
          })

          expect(getMountOption(event)).toEqual({
            directory: '/dev',
            rewriteEventPath: '/dev/.well-known/openid-configuration'
          })
        })

      })

    })

    describe('when provided child dir.', () => {

      describe('invoke with api gateway custom domain that mapped on root dir.', () => {

        it('return undefined.', () => {
          const event = generateDummyAPIGatewayEvent({
            resource: '/oidc/{proxy+}',
            pathParameters: {
              proxy: '.well-known/openid-configuration'
            },
            requestContext: {
              path: '/oidc/.well-known/openid-configuration'
            }
          })

          expect(getMountOption(event)).toEqual({
            directory: '/oidc',
            rewriteEventPath: '/oidc/.well-known/openid-configuration'
          })
        })

      })

      describe('invoke with api gateway custom domain that mapped on child dir.', () => {

        it('return mount option.', () => {
          const event = generateDummyAPIGatewayEvent({
            resource: '/oidc/{proxy+}',
            pathParameters: {
              proxy: '.well-known/openid-configuration'
            },
            requestContext: {
              path: '/auth/oidc/.well-known/openid-configuration'
            }
          })

          expect(getMountOption(event)).toEqual({
            directory: '/auth/oidc',
            rewriteEventPath: '/auth/oidc/.well-known/openid-configuration'
          })
        })

      })

      describe('invoke with execute-api endpoint.', () => {

        it('return mount option.', () => {
          const event = generateDummyAPIGatewayEvent({
            resource: '/oidc/{proxy+}',
            pathParameters: {
              proxy: '.well-known/openid-configuration'
            },
            requestContext: {
              path: '/dev/oidc/.well-known/openid-configuration'
            }
          })

          expect(getMountOption(event)).toEqual({
            directory: '/dev/oidc',
            rewriteEventPath: '/dev/oidc/.well-known/openid-configuration'
          })
        })

      })

    })

  })

})
