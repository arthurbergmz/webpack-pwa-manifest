'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildResources = buildResources;
exports.injectResources = injectResources;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Fingerprint = require('./Fingerprint');

var _Fingerprint2 = _interopRequireDefault(_Fingerprint);

var _Icons = require('./Icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function manifest(options, publicPath, icons, callback) {
  var content = Object.assign({ icons: icons }, options);
  delete content.filename;
  delete content.inject;
  delete content.fingerprints;
  var json = JSON.stringify(content, null, 2);
  var filename = _path2.default.parse(options.filename);
  var output = options.fingerprints ? filename.name + '.' + (0, _Fingerprint2.default)(json) + filename.ext : '' + filename.name + filename.ext;
  callback(null, {
    output: output,
    file: _path2.default.join(publicPath, output),
    source: json,
    size: json.length
  });
}

function buildResources(_this, publicPath, callback) {
  if (_this.assets && _this.options.inject) {
    // already cached and ready to inject
    callback();
  } else {
    publicPath = publicPath || '';
    (0, _Icons.parseIcons)(_this.options.fingerprints, publicPath, (0, _Icons.retrieveIcons)(_this.options), function (err, result) {
      if (err) return;
      manifest(_this.options, publicPath, result.icons, function (fail, manifest) {
        if (fail) return;
        _this.options.filename = manifest.file;
        _this.assets = [manifest].concat(_toConsumableArray(result.assets || []));
        callback();
      });
    });
  }
}

function injectResources(compilation, assets, callback) {
  if (assets) {
    var _loop = function _loop(asset) {
      compilation.assets[asset.output] = {
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
      for (var _iterator = assets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
}