const url = require('url')
const whatwgUrl = require('whatwg-url')

Object.entries(whatwgUrl).forEach(([k, v]) => {
  url[k] = v
})
