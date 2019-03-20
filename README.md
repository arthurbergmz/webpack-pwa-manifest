
# webpack-pwa-manifest

> Work in progress

`webpack-pwa-manifest` is a webpack plugin that generates a 'manifest.json' for your Progressive Web Application, with auto icon resizing and fingerprinting support.

If you are using `inject` on your configuration, ensure that [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin) appears *before* `WebpackPwaManifest` in the `plugins` array!

### To Do
 - Adapter to v5
   - Convert .size to .sizes