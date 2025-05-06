// webpack.build.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // 1) Giriş noktası
  entry: './index.js',

  // 2) Node.js hedefi
  target: 'node',

  // 3) Prod modu (minify + optimizasyon)
  mode: 'production',

  // 4) node_modules'u bundle dışında tut
  externals: [nodeExternals()],

  // 5) Çıktı ayarları
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },

  // 6) JS dosyalarını derlemek için Babel
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

  // 7) Uzantılar
  resolve: {
    extensions: ['.js', '.json']
  }
};
