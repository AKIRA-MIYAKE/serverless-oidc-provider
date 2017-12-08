require('@babel/polyfill')

require('./shims/url')
require('./shims/util')

require('@babel/register')({
  presets: [
    ["@babel/preset-env", {
      "targets": { "node": "6.10" }
    }]
  ],
  ignore: [filename => {
    if (filename.match(/node_modules\/oidc-provider/)) {
      return false
    } else if (filename.match(/node_modules\/koa/)) {
      return false
    } else {
      return true
    }
  }],
  cache: false,
  babelrc: false
})
