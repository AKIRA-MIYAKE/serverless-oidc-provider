const { generatePolicy } = require('../../../../src/app/authorize/helpers/generate-policy')

describe('app/authorize/helpers/generate-policy', () => {

  describe('generatePolicy()', () => {

    describe('when passed params that required.', () => {

      it('return policy.', () => {
        const policy = generatePolicy('principal', 'Allow', 'arn:aws:execute-api')
        expect(policy).toEqual({
          principalId: 'principal',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [{
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: 'arn:aws:execute-api'
            }]
          }
        })
      })

    })

    describe('when passed params with auth context.', () => {
      const policy = generatePolicy('principal', 'Allow', 'arn:aws:execute-api', {
        client_id: 'client',
        sub: 'sub'
      })

      expect(policy).toEqual({
        principalId: 'principal',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [{
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'arn:aws:execute-api'
          }]
        },
        context: {
          client_id: 'client',
          sub: 'sub'
        }
      })
    })

  })

})
