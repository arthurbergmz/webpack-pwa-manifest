'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_this, htmlPluginData, callback) {
  if (_this.assets && _this.options.inject) {
    callback();
  } else {
    (0, _Icons.parseIcons)(_this.options.fingerprints, (0, _Icons.retrieveIcons)(_this.options), function (err, result) {
      if (err) return;
      manifest(_this.options, result.icons, function (fail, manifest) {
        if (fail) return;
        _this.options.filename = manifest.file;
        _this.assets = [manifest].concat(_toConsumableArray(result.assets || []));
        callback();
      });
    });
  }
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Fingerprint = require('./Fingerprint');

var _Fingerprint2 = _interopRequireDefault(_Fingerprint);

var _Icons = require('./Icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function manifest(options, icons, callback) {
  var content = Object.assign({ icons: icons }, options);
  delete content.filename;
  delete content.inject;
  delete content.fingerprints;
  var json = JSON.stringify(content, null, 2);
  var filename = _path2.default.parse(options.filename);
  callback(null, {
    file: options.fingerprints ? filename.name + '.' + (0, _Fingerprint2.default)(json) + filename.ext : '' + filename.name + filename.ext,
    source: json,
    size: json.length
  });
}