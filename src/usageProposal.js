import WebpackPwaManifest from 'webpack-pwa-manifest'

const pluginOptions = {
  output: {
    filename: 'manifest.[hash].json',
    destination: '/manifest'
  },
  icons: {
    filename: 'icon_[size].[hash][ext]',
    destination: '/folder/with/icons/'
  },
  injectHtml: true, // default value
  publicPath: null, // default value
  includeDirectory: true // default value
}

const manifest = {
  name: 'App',
  orientation: 'portrait',
  display: 'standalone',
  start_url: '.'
}

const icons = [
  {
    type: 'chrome', // default, so you can omit this line
    src: 'src/assets/icons/default.png',
    sizes: [120, 152, 167, 180, 1024],
    filename: '[name].[hash][ext]', // optional
    destination: 'icons/default' // optional, default value is iconDestination in pluginOptions
  },
  {
    type: 'favicon', // default, so you can omit this line
    src: 'src/assets/icons/favicon.png',
    sizes: [16, 32, 48, 64, 128],
    filename: '[name]_[size].[hash][ext]', // optional
    destination: 'icons/favicon' // optional, default value is iconDestination in pluginOptions
  },
  {
    type: 'safari',
    'apple-mobile-web-app-capable': 'yes', // or true
    'apple-mobile-web-app-title': 'AppName',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-touch-startup-image': {
      src: 'src/assets/icons/ios-startup.png',
      size: 1024,
      filename: '[name].[hash][ext]', // optional
      destination: 'icons/ios' // optional, default value is iconDestination in pluginOptions
    },
    'apple-touch-icons': [ // or `icons`
      {
        src: 'src/assets/icons/ios-icon.png',
        sizes: [120, 152, 167, 180, 1024],
        filename: '[name].[hash][ext]', // optional
        destination: 'icons/ios' // optional, default value is iconDestination in pluginOptions
      }
    ]
  },
  {
    type: 'edge',
    filename: 'browserconfig.[hash].xml',
    destination: '/manifest',
    msapplication: {
      tile: {
        square: [
          {
            src: 'src/assets/icons/ms-tile-square-small-icon.png',
            filename: '[name]_[size].[hash][ext]',
            sizes: [70, 150],
            destination: 'icons/ms' // optional, default value is iconDestination in pluginOptions
          },
          {
            src: 'src/assets/icons/ms-tile-square-large-icon.png',
            filename: '[name].[hash][ext]', // optional
            sizes: [310],
            destination: 'icons/ms' // optional, default value is iconDestination in pluginOptions
          }
        ],
        wide: {
          src: 'src/assets/icons/ms-tile-wide-icon.png',
          filename: '[name]_[size].[hash][ext]', // optional
          sizes: ['310x150'],
          destination: 'icons/ms' // optional, default value is iconDestination in pluginOptions
        },
        tileColor: '#009900'
      },
      badge: {
        pollingUri: 'badge.xml',
        frequency: 30
      },
      notification: {
        pollingUri: '1.xml',
        pollingUri2: '2.xml',
        pollingUri3: '3.xml',
        pollingUri4: '4.xml',
        pollingUri5: '5.xml',
        frequency: 30,
        cycle: 1
      }
    }
  }
]

const manifestOptions = { icons, ...manifest }

const webpackConfig = {
  // ...
  plugins: [
    // ...
    new WebpackPwaManifest(manifestOptions, pluginOptions)
  ]
}
