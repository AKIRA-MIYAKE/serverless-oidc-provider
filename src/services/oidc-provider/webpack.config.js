const path = require('path')

module.exports = {
  entry: [
    path.resolve(__dirname, '../../_runtime/index.js'),
    path.resolve(__dirname, 'handler.js')
  ],
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '.webpack'),
    filename: 'handler.js'
  },
  externals: [
    'aws-sdk',
    '@babel/polyfill',
    '@babel/register',
    'oidc-provider',
    'oidc-provider/lib/helpers/weak_cache',
    'oidc-provider/lib/shared/error_handler',
    'oidc-provider/lib/shared/selective_body',
    'oidc-provider-dynamodb-adapter/fallback',
    'koa',
    'koa-compose',
    'koa-body',
    'koa-logger',
    'koa-mount',
    'koa-router',
    'ejs'
  ],

  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        include: ['/serverless-oidc-provider/src']
      },
      {
        test: /\.ejs$/,
        loaders: ['raw-loader'],
        include: ['/serverless-oidc-provider/src']
      }
    ]
  },
  devtool: '#source-map'
}
