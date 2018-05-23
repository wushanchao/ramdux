'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionTypes = undefined;
exports.default = createStore;

var _utils = require('./utils.js');

var ActionTypes = exports.ActionTypes = {
  INIT: '@@ramdux/INIT'
};

function createStore(reducer, preloadedState, enhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  var originDispatch = function originDispatch(isPromise) {
    return function (action) {
      if ((0, _utils.type)(action) !== "Object") {
        throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
      }

      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
      }

      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.');
      }

      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }

      var listeners = currentListeners = nextListeners;
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener();
      }

      if (isPromise) {
        return Promise.resolve(currentState);
      }
      return action;
    };
  };

  var dispatch = originDispatch();
  var dispatchP = originDispatch(true);

  dispatch({ type: ActionTypes.INIT });

  return {
    dispatch: dispatch,
    dispatchP: dispatchP,
    subscribe: subscribe,
    getState: getState
  };
}