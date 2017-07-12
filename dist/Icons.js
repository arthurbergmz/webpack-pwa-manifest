'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retrieveIcons = retrieveIcons;
exports.parseIcons = parseIcons;

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var _mime = require('mime');

var _mime2 = _interopRequireDefault(_mime);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Fingerprint = require('./Fingerprint');

var _Fingerprint2 = _interopRequireDefault(_Fingerprint);

var _IconError = require('./errors/IconError');

var _IconError2 = _interopRequireDefault(_IconError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseArray(i) {
  return i && !Array.isArray(i) ? [i] : i;
}

function sanitizeIcon(iconSnippet) {
  if (!iconSnippet.src) throw new _IconError2.default('Unknown icon source.');
  var arr = parseArray(iconSnippet.size || iconSnippet.sizes);
  if (!arr) throw new _IconError2.default('Unknown icon sizes.');
  var sizes = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var size = _step.value;
      sizes.push(+size || parseInt(size));
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

  return {
    src: iconSnippet.src,
    sizes: sizes,
    destination: iconSnippet.destination
  };
}

function process(sizes, icon, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback) {
  var size = sizes.pop();
  if (size > 0) {
    var type = _mime2.default.lookup(icon.src);
    _jimp2.default.read(icon.src, function (err, img) {
      if (err) throw new _IconError2.default('It was not possible to read \'' + icon.src + '\'.');
      img.resize(size, size).getBuffer(type, function (err, buffer) {
        if (err) throw new _IconError2.default('It was not possible to retrieve buffer of \'' + icon.src + '\'.');
        var sizeFormat = size + 'x' + size;
        var filename = fingerprint ? 'icon_' + sizeFormat + '.' + (0, _Fingerprint2.default)(buffer) + '.' + _mime2.default.extension(type) : 'icon_' + sizeFormat + '.' + _mime2.default.extension(type);
        var output = icon.destination ? _path2.default.join(icon.destination, filename) : filename;
        icons.push({
          src: _path2.default.join(publicPath, output),
          sizes: sizeFormat,
          type: type
        });
        assets.push({
          output: output,
          source: buffer,
          size: buffer.length
        });
        if (sizes.length > 0) {
          process(sizes, icon, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback // next size
          );
        } else if (cachedIconsCopy.length > 0) {
          var next = cachedIconsCopy.pop();
          process(next.sizes, next, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback // next icon
          );
        } else {
          callback(null, { icons: icons, assets: assets } // there are no more icons left
          );
        }
      });
    });
  }
}

function retrieveIcons(options) {
  var icons = parseArray(options.icon || options.icons);
  var response = [];
  if (icons) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = icons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var icon = _step2.value;
        response.push(sanitizeIcon(icon));
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }delete options.icon;
  delete options.icons;
  return response;
}

function parseIcons(fingerprint, publicPath, icons, callback) {
  if (icons.length === 0) {
    callback(null, {});
  } else {
    var first = icons.pop();
    process(first.sizes, first, icons, [], [], fingerprint, publicPath, callback);
  }
}