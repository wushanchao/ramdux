'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _utils = require('./utils.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var connect = function connect(listenable, outerContext, storeName) {

  return function (otherReactClass) {
    return function (_otherReactClass) {
      _inherits(baseReactClass, _otherReactClass);

      function baseReactClass(props) {
        _classCallCheck(this, baseReactClass);

        return _possibleConstructorReturn(this, (baseReactClass.__proto__ || Object.getPrototypeOf(baseReactClass)).call(this, props));
      }

      _createClass(baseReactClass, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          // 这里的context就是react组件的上下文了

          var store = listenable();
          console.log('listenable', listenable, store);
          var context = outerContext || this;

          var originDispatchP = store.dispatchP;
          var originGetState = store.getState;

          store.trigger = function (obj, fn) {
            context.setState(obj || {}, fn);
          };
          store.getReactState = function () {
            return context.state;
          };
          store.dispatch = function (obj) {
            var state = context.state;
            var dispatchObj = {
              state: state
            };
            dispatchObj = (0, _utils.merge)(dispatchObj, obj);
            return originDispatchP(dispatchObj);
          };
          store.getState = function () {
            return Promise.resolve(originGetState());
          };
          if (storeName) {
            context[storeName] = store;
          } else {
            context.$$store = store;
          }

          _get(baseReactClass.prototype.__proto__ || Object.getPrototypeOf(baseReactClass.prototype), 'componentDidMount', this) && _get(baseReactClass.prototype.__proto__ || Object.getPrototypeOf(baseReactClass.prototype), 'componentDidMount', this).call(this);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.store = null;
          _get(baseReactClass.prototype.__proto__ || Object.getPrototypeOf(baseReactClass.prototype), 'componentWillUnmount', this) && _get(baseReactClass.prototype.__proto__ || Object.getPrototypeOf(baseReactClass.prototype), 'componentWillUnmount', this).call(this);
        }
      }]);

      return baseReactClass;
    }(otherReactClass);
  };
};

exports.default = connect;