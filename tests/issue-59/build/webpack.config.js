const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('../../../dist')

module.exports = {
  entry: path.join(__dirname, '../app.js'),
  output: {
    path: path.join(__dirname, '../output'),
    publicPath: '://www.cdn.com/',
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
      name: 'My Progressive Web App',
      short_name: 'MyPWA',
      description: 'My awesome Progressive Web App!',
      background_color: '#ffffff',
      ios: true,
      icons: [
        {
          ios: 'startup',
          src: path.resolve('./tests/icon.png'),
          destination: 'icons',
          sizes: '640x1136'
        }, {
          ios: 'startup',
          src: path.resolve('./tests/icon.png'),
          destination: 'icons',
          sizes: '750x1334'
        }, {
          ios: 'startup',
          src: path.resolve('./tests/icon.png'),
          destination: 'icons',
          sizes: '768x1024'
        }
      ]
    })
  ]
}
