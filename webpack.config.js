// webpack.config.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: { presets: ['@babel/preset-env'] }
    }]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public/', to: '.' },
      ]
    })
  ],
  stats: 'verbose',
  devtool: 'source-map'
}