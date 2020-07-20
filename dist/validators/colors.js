"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _cssColorNames = _interopRequireDefault(require("css-color-names"));

var _PresetError = _interopRequireDefault(require("../errors/PresetError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// @ts-ignore
function isHexColor(color) {
  return /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(color);
}

function isCssColor(color) {
  return typeof color === 'string' && _cssColorNames["default"][color];
}

function isRgbColor(color) {
  return /rgb\([\d]{1,3}, [\d]{1,3}, [\d]{1,3}\)/.test(color);
}

function isRgbaColor(color) {
  return /rgba\([\d]{1,3}, [\d]{1,3}, [\d]{1,3}, \d\.\d+\)/.test(color);
}

function _default(config) {
  if (!config) return;

  for (var _len = arguments.length, properties = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    properties[_key - 1] = arguments[_key];
  }

  for (var _i = 0, _properties = properties; _i < _properties.length; _i++) {
    var property = _properties[_i];
    var color = config[property];
    if (color && !(isHexColor(color) || isCssColor(color) || isRgbColor(color) || isRgbaColor(color))) throw new _PresetError["default"](property, color);
  }
}