# webpack-pwa-manifest

Webpack plugin that generates a 'manifest.json' for your Progressive Web Application

# To-Do list

 • Refactoring

 • Manifest signature
 
 • Auto inject `<link rel="manifest" href="manifest.<signature>.json" />`

# install
```javascript
npm install --save-dev webpack-pwa-manifest
```

# usage
In your `webpack.config.js`:
```javascript
// ES2015
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
                size: '1024x1024' // manifest default
            }
        ]
    })
]
```

# output

`manifest.json`
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
      "src": "icon_1024x1024.png",
      "sizes": "1024x1024",
      "type": "image/png"
    },
    {
      "src": "icon_512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "icon_384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icon_256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "icon_192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon_128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icon_96x96.png",
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

```json
{
  "filename": "manifest.json",
  "name": "App",
  "orientation": "portrait",
  "display": "standalone",
  "start_url": "."
}
```

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