'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Presets = require('./Presets');

var _Presets2 = _interopRequireDefault(_Presets);

var _Colors = require('./Colors');

var _Colors2 = _interopRequireDefault(_Colors);

var _Versioning = require('./Versioning');

var _Injector = require('./Injector');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebpackPwaManifest = function () {
  function WebpackPwaManifest(options) {
    _classCallCheck(this, WebpackPwaManifest);

    (0, _Presets2.default)(options, 'dir', 'display', 'orientation');
    (0, _Colors2.default)(options, 'background_color', 'theme_color');
    this.options = Object.assign({
      filename: 'manifest.json',
      name: 'App',
      orientation: 'portrait',
      display: 'standalone',
      start_url: '.',
      inject: true,
      fingerprints: true
    }, options || {});
    (0, _Versioning.checkDeprecated)(this.options, 'useWebpackPublicPath');
    this.options.short_name = this.options.short_name || this.options.name;
    this.assets = null;
    this.htmlPlugin = false;
  }

  _createClass(WebpackPwaManifest, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;
      compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
          if (!_this.htmlPlugin) _this.htmlPlugin = true;
          (0, _Injector.buildResources)(_this, compilation.options.output.publicPath, function () {
            if (_this.options.inject) {
              htmlPluginData.html = htmlPluginData.html.replace(/(<\/head>)/i, '<link rel="manifest" href="' + _this.options.filename + '" /></head>');
            }
            callback(null, htmlPluginData);
          });
        });
      });
      compiler.plugin('emit', function (compilation, callback) {
        if (_this.htmlPlugin) {
          (0, _Injector.injectResources)(compilation, _this.assets, callback);
        } else {
          (0, _Injector.buildResources)(_this, compilation.options.output.publicPath, function () {
            (0, _Injector.injectResources)(compilation, _this.assets, callback);
          });
        }
      });
    }
  }]);

  return WebpackPwaManifest;
}();

module.exports = WebpackPwaManifest;