const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    "cm/main": "./cm/src/js/main.js",
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
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'node_modules/pdfjs-dist/cmaps/',
          to: 'cm/pdf.cmaps/',
        },
        {
          from: 'node_modules/pdfjs-dist/build/pdf.sandbox.js',
          to: 'cm/pdf.sandbox.js',
        },
        // { from: "source", to: "dest" },
        // { from: "other", to: "public" },
      ],
    }),
  ],
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