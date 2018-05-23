import { type } from './utils.js';

export const ActionTypes = {
  INIT: '@@ramdux/INIT'
}


export default function createStore(reducer, preloadedState, enhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }


  function getState() {
    return currentState
  }

 
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

 
  const originDispatch = function (isPromise) {
    return function (action) {
      if (type(action) !== "Object") {
        throw new Error(
          'Actions must be plain objects. ' +
          'Use custom middleware for async actions.'
        )
      }

      if (typeof action.type === 'undefined') {
        throw new Error(
          'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?'
        )
      }

      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.')
      }

      try {
        isDispatching = true
        currentState = currentReducer(currentState, action)
      } finally {
        isDispatching = false
      }

      const listeners = currentListeners = nextListeners
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i]
        listener()
      }

      if(isPromise){
        return Promise.resolve(currentState)
      }
      return action
    }
  };

  const dispatch = originDispatch();
  const dispatchP = originDispatch(true);

  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    dispatchP,
    subscribe,
    getState,
  }
}