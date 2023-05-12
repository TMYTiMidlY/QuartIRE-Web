const path = require('path');

module.exports = {
  entry: {
    // index: './src/index.js',
    // print: './src/print.js',
    // editor: './src/editor.js',
    "cm/main": './cm/src/js/main.js',
    // "cm/sidebar": './cm/src/js/sidebar.js',
  },
  output: {
    path: path.resolve(__dirname, "dist"), // Should be in STATICFILES_DIRS
    publicPath: "/static/", // Should match Django STATIC_URL
    filename: "[name].bundle.js", // No filename hashing, Django takes care of this
    chunkFilename: "[id]-[chunkhash].js", // DO have Webpack hash chunk filename, see below
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    // port: 8090,
    static: false, // Don't serve static files from Webpack, Django handles this
    devMiddleware: {
      writeToDisk: true, // Write files to disk in dev mode, so Django can serve the assets
    }
  },
};