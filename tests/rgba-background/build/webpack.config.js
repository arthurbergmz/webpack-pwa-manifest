const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('../../../dist')

module.exports = {
  entry: path.join(__dirname, '../app.js'),
  output: {
    path: path.join(__dirname, '../output'),
    publicPath: '/',
    filename: '[name].[fullhash].bundle.js'
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
      name: 'My Progressive Web App',
      short_name: 'MyPWA',
      description: 'My awesome Progressive Web App!',
      background_color: 'rgba(123, 23, 12, 0.3)',
      ios: true,
      icons: [
        {
          src: path.resolve('./tests/icon.png'),
          sizes: 512,
          destination: 'icons'
        },
        {
          src: path.resolve('./tests/icon.png'),
          size: 1024,
          destination: 'icons',
          ios: true
        },
        {
          src: path.resolve('./tests/icon.svg'),
          sizes: 512,
          destination: 'icons',
          color: '#ffffff'
        }
      ]
    })
  ]
}
