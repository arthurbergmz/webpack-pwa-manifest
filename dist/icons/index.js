"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retrieveIcons = retrieveIcons;
exports.parseIcons = parseIcons;

var _fs = _interopRequireDefault(require("fs"));

var _jimp = _interopRequireDefault(require("jimp"));

var _mime = _interopRequireDefault(require("mime"));

var _uri = require("../helpers/uri");

var _fingerprint = _interopRequireDefault(require("../helpers/fingerprint"));

var _IconError = _interopRequireDefault(require("../errors/IconError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var supportedMimeTypes = [_jimp["default"].MIME_PNG, _jimp["default"].MIME_JPEG, _jimp["default"].MIME_BMP];

function parseArray(i) {
  return i && !Array.isArray(i) ? [i] : i;
}

function sanitizeIcon(iconSnippet) {
  if (!iconSnippet.src) throw new _IconError["default"]('Unknown icon source.');
  var arr = parseArray(iconSnippet.size || iconSnippet.sizes);
  if (!arr) throw new _IconError["default"]('Unknown icon sizes.');
  var sizes = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var size = _step.value;
      typeof arr[0] === 'number' ? sizes.push(+size || parseInt(size)) : sizes.push(size);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
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
    destination: iconSnippet.destination,
    ios: iconSnippet.ios || false,
    color: iconSnippet.color,
    purpose: iconSnippet.purpose
  };
}

function processIcon(currentSize, icon, buffer, mimeType, publicPath, shouldFingerprint) {
  var dimensions = typeof currentSize === 'number' ? "".concat(currentSize, "x").concat(currentSize) : currentSize;

  if (dimensions.split('x').length === 0) {
    throw new _IconError["default"]("Unexpected size format: ".concat(currentSize, ". Must be a number or string \"WxH\"'"));
  }

  var fileName = shouldFingerprint ? "icon_".concat(dimensions, ".").concat((0, _fingerprint["default"])(buffer), ".").concat(_mime["default"].getExtension(mimeType)) : "icon_".concat(dimensions, ".").concat(_mime["default"].getExtension(mimeType));
  var iconOutputDir = icon.destination ? (0, _uri.joinURI)(icon.destination, fileName) : fileName;
  var iconPublicUrl = (0, _uri.joinURI)(publicPath, iconOutputDir);
  return {
    manifestIcon: {
      src: iconPublicUrl,
      sizes: dimensions,
      type: mimeType,
      purpose: icon.purpose
    },
    webpackAsset: {
      output: iconOutputDir,
      url: iconPublicUrl,
      source: buffer,
      size: buffer.length,
      ios: icon.ios ? {
        valid: icon.ios,
        size: dimensions,
        href: iconPublicUrl
      } : false,
      color: icon.color
    }
  };
}

function process(sizes, icon, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback) {
  var processNext = function processNext() {
    if (sizes.length > 0) {
      return process(sizes, icon, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback); // next size
    } else if (cachedIconsCopy.length > 0) {
      var next = cachedIconsCopy.pop();
      return process(next.sizes, next, cachedIconsCopy, icons, assets, fingerprint, publicPath, callback); // next icon
    } else {
      return callback(null, {
        icons: icons,
        assets: assets
      }); // there are no more icons left
    }
  };

  var size = sizes.pop();

  if (size > 0 || typeof size === 'string') {
    var mimeType = _mime["default"].getType(icon.src);

    if (!supportedMimeTypes.includes(mimeType)) {
      var buffer;

      try {
        buffer = _fs["default"].readFileSync(icon.src);
      } catch (err) {
        throw new _IconError["default"]("It was not possible to read '".concat(icon.src, "'."));
      }

      var processedIcon = processIcon(size, icon, buffer, mimeType, publicPath, fingerprint);
      icons.push(processedIcon.manifestIcon);
      assets.push(processedIcon.webpackAsset);
      return processNext();
    }

    _jimp["default"].read(icon.src, function (err, img) {
      if (err) throw new _IconError["default"]("It was not possible to read '".concat(icon.src, "'."));
      var x = size,
          y = size,
          tmp;

      if (typeof size === 'string') {
        tmp = size.split('x');
        x = Number(tmp[0]);
        y = Number(tmp[1]);
      }

      img.resize(x, y).getBuffer(mimeType, function (err, buffer) {
        if (err) throw new _IconError["default"]("It was not possible to retrieve buffer of '".concat(icon.src, "'."));
        var processedIcon = processIcon(size, icon, buffer, mimeType, publicPath, fingerprint);
        icons.push(processedIcon.manifestIcon);
        assets.push(processedIcon.webpackAsset);
        return processNext();
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
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  delete options.icon;
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