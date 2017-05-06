# webpack-pwa-manifest

Webpack plugin that generates a 'manifest.json' for your Progressive Web Application

# usage
```javascript
npm install --save-dev webpack-pwa-manifest
```

In your `webpack.config.js`:
```javascript
import WebpackPwaManifest from 'webpack-pwa-manifest'

...

plugins: [
    new WebpackPwaManifest({
        name: 'My Progressive Web App',
        short_name: 'MyPWA',
        description: 'My awesome Progressive Web App!',
        background_color: '#ffffff',
        icons: [
            {
                src: path.resolve('src/assets/icon.png')
                sizes: [96, 128, 192, 256, 384, 512] // auto resize
            },
            {
                src: path.resolve('src/assets/large-icon.png'),
                size: '1024x1024' // manifest default
            }
        ]
    })
]
```