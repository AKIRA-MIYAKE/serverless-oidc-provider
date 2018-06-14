const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: [
    path.resolve(__dirname, 'handler.js')
  ],
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '.webpack'),
    filename: 'handler.js'
  },
  externals: [
    'aws-sdk',
    'oidc-provider',
    'oidc-provider/lib/helpers/weak_cache',
    'oidc-provider/lib/shared/error_handler',
    'oidc-provider/lib/shared/selective_body',
    'oidc-provider-dynamodb-adapter',
    'aws-serverless-express',
    'koa',
    'koa-compose',
    'koa-logger',
    'koa-mount',
    'ejs'
  ],

  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
      {
        test: /\.ejs$/,
        use: ['raw-loader']
      }
    ]
  },
  devtool: '#source-map'
}
