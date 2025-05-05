const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
        patterns: [
            { from: 'public', to: 'public' },
        ]
    }),
    new (require('webpack')).IgnorePlugin({
      resourceRegExp: /\.html$/
    }),
    new (require('webpack')).IgnorePlugin({
      resourceRegExp: /node-gyp|mock-aws-s3|aws-sdk|nock/
    })
  ]
};
