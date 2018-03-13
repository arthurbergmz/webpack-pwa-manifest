// [!] v4.0.0 Conventions
//
// - 'sizes' will accept the following values:
//    * a single dimension string (e.g { sizes: '128x128' })
//    * a single integer (e.g { sizes: 128 })
//    * a single integer in string (e.g { sizes: '128' })
//    * a string containg a list of space-separeted dimensions (e.g { sizes: '128 256x256 512' })
//    * an array of dimensions, whether they are string or integer (e.g { sizes: ['128', '256x256', 512 ] })
//
// - 'size' will be deprecated
//
// - Possible 'filename' placeholders: 'name', 'size', 'hash', 'ext'
//
// - New plugin usage proposal:
//

import WebpackPwaManifest from 'webpack-pwa-manifest'

export const webpackConfig = {
  // ...
  plugins: [
    // ...
    new WebpackPwaManifest({
      output: { // default values, plugin config
        publicPath: null, // default value, plugin config
        injectHtml: true, // default value, plugin config
        includeDirectory: true, // default value, plugin config
        manifest: {
          filename: 'manifest.json',
          destination: '/manifest'
        },
        icons: {
          filename: '[name]_[size].[hash][ext]',
          destination: '/manifest/icons'
        }
      },
      manifest: {
        name: 'App', // default value
        orientation: 'portrait', // default value
        display: 'standalone', // default value
        start_url: '.', // default value
        // ... any other properties
        icons: [
          {
            src: 'src/assets/icons/default.png',
            sizes: [120, 152, 167, 180, 1024],
            filename: '[name]_[size].[hash][ext]', // optional
            destination: 'icons/default', // optional, default value is iconDestination in pluginOptions
            purpose: 'badge', // optional
            platform: 'play', // optional
            density: 1.0 // optional
          }
        ]
      },
      favicons: [
        {
          src: 'src/assets/icons/favicon_small.png',
          sizes: [16, 32, 48, 64],
          filename: '[name]_[size].[hash][ext]', // optional
          destination: '/favicons' // optional, default value is iconDestination in pluginOptions
        },
        {
          src: 'src/assets/icons/favicon_large.png',
          sizes: [128, 256, 512],
          filename: '[name]_[size].[hash][ext]', // optional
          destination: '/favicons' // optional, default value is iconDestination in pluginOptions
        }
      ],
      safari: {
        webAppCapable: 'yes', // "yes"/"no" or true/false. "yes" as default. renders to 'apple-mobile-web-app-capable'
        webAppTitle: 'App', // default value. renders to 'apple-mobile-web-app-title'
        webAppStatusBarStyle: 'default', // default value. renders to 'apple-mobile-web-app-status-bar-style'
        startupImage: { // renders to 'apple-touch-startup-image'
          src: 'src/assets/icons/ios-startup.png',
          sizes: 1024,
          filename: '[name].[hash][ext]', // optional
          destination: 'icons/ios' // optional, default value is iconDestination in pluginOptions
        },
        maskIcon: { // renders to 'mask-icon'
          src: 'src/assets/icons/ios-pinned.png',
          sizes: 16,
          filename: '[name].[hash][ext]', // optional
          destination: 'icons/ios', // optional, default value is iconDestination in pluginOptions,
          color: '#ffffff'
        },
        icons: [ // renders to 'apple-touch-icons'
          {
            src: 'src/assets/icons/ios-icon.png',
            sizes: [120, 152, 167, 180, 1024],
            filename: '[name]_[size].[hash][ext]', // optional
            destination: 'icons/ios' // optional, default value is iconDestination in pluginOptions
          }
        ]
      }
    })
  ]
}
