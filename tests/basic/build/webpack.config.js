const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('../../../dist')

module.exports = {
  entry: path.join(__dirname, '../app.js'),
  output: {
    path: path.join(__dirname, '../output'),
    publicPath: '/',
    filename: '[name].[hash].bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      minify: {
        minifyCSS: true,
        minifyJS: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        preserveLineBreaks: false,
        removeAttributeQuotes: true,
        removeComments: true
      }
    }),
    new WebpackPwaManifest({
      manifest: {
        name: 'My Progressive Web App',
        short_name: 'MyPWA',
        description: 'My awesome Progressive Web App!',
        background_color: '#ffffff',
        icons: [
          {
            src: path.resolve('./tests/icon.png'),
            sizes: 512,
            destination: 'icons'
          },
          {
            src: path.resolve('./tests/icon.png'),
            sizes: 1024,
            destination: 'icons',
          },
          {
            src: path.resolve('./tests/icon.svg'),
            sizes: 512,
            destination: 'icons',
            color: '#ffffff'
          }
        ]
      },
      safari: {
        startupImage: {
          src: path.resolve('./tests/icon.png'),
          sizes: 1024,
          destination: 'icons/ios',
          filename: 'startup_[name].[hash][ext]'
        },
        maskIcon: {
          src: path.resolve('./tests/icon.png'),
          sizes: 16,
          destination: 'icons/ios',
          filename: 'mask_[name].[hash][ext]',
          color: '#ffffff'
        },
        icons: [
          {
            src: path.resolve('./tests/icon.png'),
            sizes: [120, 152, 167, 180, 1024],
            destination: 'icons/ios',
          }
        ]
      }
    })
  ]
}
