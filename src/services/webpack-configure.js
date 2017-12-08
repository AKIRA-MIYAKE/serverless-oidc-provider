const path = require('path')

module.exports = dirname => ({
  entry: path.resolve(dirname, 'handler.js'),
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(dirname, '.webpack'),
    filename: 'handler.js'
  },
  externals: ['aws-sdk'],

  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        include: ['/serverless-app/src']
      }
    ]
  },
  devtool: '#source-map'
})
