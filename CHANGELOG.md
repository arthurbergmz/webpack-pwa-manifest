## 3.3.0 (2017-09-12)

- Added 'publicPath' option. See more information at [issue #20](https://github.com/arthurbergmz/webpack-pwa-manifest/issues/20).

## 3.2.0 (2017-08-18)

- Added Apple's Web Application injection. See more information at [issue #13](https://github.com/arthurbergmz/webpack-pwa-manifest/issues/13);
- Added `theme-color` injection. See more information at [issue #18](https://github.com/arthurbergmz/webpack-pwa-manifest/issues/18);
- Added `ios` property into options.
- Added `ios` property into icon options.
- See README.md for detailed information about the new `ios` property.

## 3.1.6 (2017-07-28)

- Fixed misbehavior with protocols' slashes. See more information at [issue #16](https://github.com/arthurbergmz/webpack-pwa-manifest/issues/16).

## 3.1.5 (2017-07-19)

- Fixed excessive "forward" slashes and backslashes. See more information at [issue #15](https://github.com/arthurbergmz/webpack-pwa-manifest/issues/15).

## 3.1.4 (2017-07-19)

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