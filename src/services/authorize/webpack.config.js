const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, 'handler.js'),
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '.webpack'),
    filename: 'handler.js'
  },
  externals: ['aws-sdk'],

  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      }
    ]
  },
  devtool: '#source-map'
}
