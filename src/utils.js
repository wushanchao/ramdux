const type = function (val) {
    return val === null ? 'Null' :
      val === undefined ? 'Undefined' :
        Object.prototype.toString.call(val).slice(8, -1);
  };
  
  const _has = function (prop, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
  
  const _objectAssign = function (target) {
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
  
  const objectAssign = (Object.assign === 'function' ? Object.assign : _objectAssign);
  
  const merge = function (l, r) {
    return objectAssign({}, l, r);
  };
  
  export {
    type,
    objectAssign,
    merge,
  };