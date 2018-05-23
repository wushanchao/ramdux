'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var type = function type(val) {
  return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
};

var _has = function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

var _objectAssign = function _objectAssign(target) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  var idx = 1;
  var length = arguments.length;
  while (idx < length) {
    var source = arguments[idx];
    if (source != null) {
      for (var nextKey in source) {
        if (_has(nextKey, source)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
    idx += 1;
  }
  return output;
};

var objectAssign = Object.assign === 'function' ? Object.assign : _objectAssign;

var merge = function merge(l, r) {
  return objectAssign({}, l, r);
};

exports.type = type;
exports.objectAssign = objectAssign;
exports.merge = merge;