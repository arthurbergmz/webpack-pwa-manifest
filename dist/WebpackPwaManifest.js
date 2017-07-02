'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Presets = require('./Presets');

var _Presets2 = _interopRequireDefault(_Presets);

var _Colors = require('./Colors');

var _Colors2 = _interopRequireDefault(_Colors);

var _Injector = require('./Injector');

var _Injector2 = _interopRequireDefault(_Injector);

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
    this.options.short_name = this.options.short_name || this.options.name;
    this.assets = null;
  }

  _createClass(WebpackPwaManifest, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;
      compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
          (0, _Injector2.default)(_this, htmlPluginData, function () {
            if (_this.options.inject) {
              var _htmlPluginData$asset = htmlPluginData.assets.publicPath,
                  publicPath = _htmlPluginData$asset === undefined ? '' : _htmlPluginData$asset;

              var filepath = publicPath + _this.options.filename;
              htmlPluginData.html = htmlPluginData.html.replace(/(<\/head>)/i, '<link rel="manifest" href="' + filepath + '" /></head>');
            }
            callback(null, htmlPluginData);
          });
        });
      });
      compiler.plugin('emit', function (compilation, callback) {
        if (_this.assets) {
          var _loop = function _loop(asset) {
            compilation.assets[asset.file] = {
              source: function source() {
                return asset.source;
              },
              size: function size() {
                return asset.size;
              }
            };
          };

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _this.assets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var asset = _step.value;

              _loop(asset);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
        callback();
      });
    }
  }]);

  return WebpackPwaManifest;
}();

module.exports = WebpackPwaManifest;