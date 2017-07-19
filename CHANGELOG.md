## 3.1.3 (2017-07-19)

- Fixed excessive slashes on output. See more information at [issue #15](https://github.com/arthurbergmz/webpack-pwa-manifest/issues/15).

## 3.1.2 (2017-07-13)

- Fixed resources URI on Windows. See more information at [issue #14](https://github.com/arthurbergmz/webpack-pwa-manifest/issues/14).

## 3.1.1 (2017-07-12)

- `useWebpackPublicPath` is now deprecated. See more information at [issue #12](https://github.com/arthurbergmz/webpack-pwa-manifest/issues/12).

## 3.1.0 (2017-07-03)

- Added `useWebpackPublicPath` into options;
- Removed _HtmlWebpackPlugin_ technical dependency (misbehavior).

## 3.0.0 (2017-06-13)

- Refactored code; **(ES6+ ready)**
- Added HTML injection support through [_HtmlWebpackPlugin_](https://github.com/jantimon/html-webpack-plugin);
- Added file fingerprinting;
- Faster hot reload support.