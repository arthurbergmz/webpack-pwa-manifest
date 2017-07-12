# webpack-pwa-manifest

Webpack plugin that generates a 'manifest.json' for your Progressive Web Application, with auto icon resizing and fingerprinting support.

If you are using `inject` on your configuration, ensure that [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin) appears *before* `WebpackPwaManifest` in the `plugins` array!

# features

 ✔ Auto icon resizing

 ✔ Icon fingerprinting

 ✔ Manifest fingerprinting

 ✔ Auto manifest injection on HTML

 ✔ Hot Reload support

 ✔ ES6+ ready

# install
```javascript
npm install --save-dev webpack-pwa-manifest
```

# usage
In your `webpack.config.js`:
```javascript
// ES6+
import WebpackPwaManifest from 'webpack-pwa-manifest'

// ES5
var WebpackPwaManifest = require('webpack-pwa-manifest')

...

plugins: [
  new WebpackPwaManifest({
    name: 'My Progressive Web App',
    short_name: 'MyPWA',
    description: 'My awesome Progressive Web App!',
    background_color: '#ffffff',
    icons: [
      {
        src: path.resolve('src/assets/icon.png'),
        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
      },
      {
        src: path.resolve('src/assets/large-icon.png'),
        size: '1024x1024' // you can also use the specifications pattern
      }
    ]
  })
]
```

# output

`manifest.<fingerprint>.json`
```json
{
  "name": "My Progressive Web App",
  "orientation": "portrait",
  "display": "standalone",
  "start_url": ".",
  "short_name": "MyPWA",
  "description": "My awesome Progressive Web App!",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "icon_1024x1024.<fingerprint>.png",
      "sizes": "1024x1024",
      "type": "image/png"
    },
    {
      "src": "icon_512x512.<fingerprint>.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "icon_384x384.<fingerprint>.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icon_256x256.<fingerprint>.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "icon_192x192.<fingerprint>.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon_128x128.<fingerprint>.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icon_96x96.<fingerprint>.png",
      "sizes": "96x96",
      "type": "image/png"
    }
  ]
}
```

# API

### WebpackPwaManifest([options])

**options**

Type: `object`

You can follow the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) [specification](https://w3c.github.io/manifest/).

The difference here is that, when defining icons, you can specify one icon with multiple sizes, using an array of integers, just as the example above.

You can also change the output's filename with the `filename` property.

Presets of `options`:

```javascript
{
  filename: "manifest.json",
  name: "App",
  orientation: "portrait",
  display: "standalone",
  start_url: ".",
  inject: true,
  fingerprints: true
}
```

By default, HTML injection and fingerprint generation are on.
With `inject: false` and `fingerprints: false`, respectively, you can turn them off.

This plugin also supports the [Webpack's public path](https://webpack.js.org/configuration/output/#output-publicpath) definition.

When defining an icon object, you can also specify its output directory using a property called `destination`.

```javascript
  ...
  icons: [
    {
      src: path.resolve('src/assets/icons/ios-icon.png'),
      sizes: [120, 152, 167, 180, 1024],
      destination: path.join('icons', 'ios')
    },
    {
      src: path.resolve('src/assets/icons/android-icon.png'),
      sizes: [36, 48, 72, 96, 144, 192, 512],
      destination: path.join('icons', 'android')
    }
  ]
}