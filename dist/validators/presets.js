"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _PresetError = _interopRequireDefault(require("../errors/PresetError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var presets = {
  dir: ['ltr', 'rtl', 'auto'],
  orientation: ['any', 'natural', 'landscape', 'landscape-primary', 'landscape-secondary', 'portrait', 'portrait-primary', 'portrait-secondary', 'omit'],
  display: ['fullscreen', 'standalone', 'minimal-ui', 'browser'],
  crossorigin: ['anonymous', 'use-credentials']
};

function hasPreset(key, value) {
  return presets[key].indexOf(value) >= 0;
}

function _default(config) {
  if (!config) return;

  for (var _len = arguments.length, properties = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    properties[_key - 1] = arguments[_key];
  }

  for (var _i = 0, _properties = properties; _i < _properties.length; _i++) {
    var property = _properties[_i];
    var value = config[property];
    if (value && !hasPreset(property, value)) throw new _PresetError["default"](property, value);
  }
}