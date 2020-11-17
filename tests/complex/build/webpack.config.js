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
      background_color: '#ffffff',
      ios: true,
      crossorigin: 'use-credentials',
      icons: [
        {
          src: path.resolve('./tests/icon.png'),
          sizes: [36, 48, 72, 96, 144, 192, 512],
          destination: path.join('icons', 'android')
        },
        {
          src: path.resolve('./tests/icon.png'),
          size: [120, 152, 167, 180, 1024],
          destination: path.join('icons', 'ios'),
          ios: true
        },
        {
          src: path.resolve('./tests/icon.png'),
          size: 1024,
          destination: path.join('icons', 'ios', 'startup'),
          ios: 'startup'
        }
      ]
    })
  ]
}
