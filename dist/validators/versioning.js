"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var deprecated = {
  useWebpackPublicPath: 'https://github.com/arthurbergmz/webpack-pwa-manifest/issues/12'
};

function _default(options) {
  for (var _len = arguments.length, properties = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    properties[_key - 1] = arguments[_key];
  }

  for (var _i = 0, _properties = properties; _i < _properties.length; _i++) {
    var property = _properties[_i];

    if (options[property]) {
      console.log("\"".concat(property, "\" is a deprecated option. Read more at \"").concat(deprecated[property], "\"."));
    }
  }
}