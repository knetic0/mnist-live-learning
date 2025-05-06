const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // Compile for Node.js environment to preserve built-ins
  target: 'node',
  externalsPresets: { node: true },  // in webpack 5, tells webpack not to polyfill Node.js modules
  externals: [nodeExternals()],       // exclude all modules in node_modules

  // Server entry point
  entry: path.resolve(__dirname, 'index.js'),

  // Output bundle configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js',
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: { filename: 'assets/images/[name][ext]' }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      inject: 'body',
    }),
    new CopyWebpackPlugin({ patterns: [
      { from: path.resolve(__dirname, 'public', 'assets'), to: 'assets' }
    ] })
  ],

  mode: 'production',
  devtool: 'source-map'
};