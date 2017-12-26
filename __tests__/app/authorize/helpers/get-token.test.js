const { getToken } = require('../../../../src/app/authorize/helpers/get-token')

describe('app/authorize/helpers/get-token', () => {

  describe('getToken()', () => {

    describe('when passed bearer token.', () => {

      it('return token.', () => {
        expect(getToken('Bearer abcdefg')).toBe('abcdefg')
      })

    })

    describe('when passed invalid token.', () => {

      it('return undefined.', () => {
        expect(getToken('abcdefg')).toBeUndefined()
      })

    })

    describe('when passed undefined.', () => {

      it('return undefined.', () => {
        expect(getToken(undefined)).toBeUndefined()
      })

    })

  })

})
