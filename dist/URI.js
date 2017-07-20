'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinURI = joinURI;
exports.normalizeURI = normalizeURI;
function joinURI() {
  for (var _len = arguments.length, arr = Array(_len), _key = 0; _key < _len; _key++) {
    arr[_key] = arguments[_key];
  }

  return normalizeURI(arr.join('/'));
}

function normalizeURI(uri) {
  return uri.replace(/(\\+|\/{2,})/g, '/');
}