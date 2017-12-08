const  { invokeHandler, generateMockCallback } = require('lambda-utilities')
const { generateDummyAPIGatewayEvent } = require('lamprox')

const { hello } = require('../../../src/services/sample/handler')

describe('services/sample/handler', () => {

  describe('hello', () => {

    it('Should return response.', done => {
      const event = generateDummyAPIGatewayEvent()
      const callback = generateMockCallback((error, result) => {
        callback.once()
        const body = JSON.parse(result.body)
        expect(body.message).toBe('Hello, Lambda!!')
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(hello, { event, callback })
    })

    it('Should return response when evnet include query string params.', done => {
      const event = generateDummyAPIGatewayEvent({ queryStringParameters: { "name": "John Doe" }})
      const callback = generateMockCallback((error, result) => {
        callback.once()
        const body = JSON.parse(result.body)
        expect(body.message).toBe('Hello, John Doe!!')
        expect(callback.verify()).toBe(true)

        done()
      })

      invokeHandler(hello, { event, callback })
    })


  })

})
