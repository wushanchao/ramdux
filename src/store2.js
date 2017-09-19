// import {createStore} from "redux";
import createStore from "./createStore.js";
import R from "ramda";
import store1 from "./store.js";



const INCREMENT = function(action){
  let state = action.state;
  return {
    value : state.value + 1
  };
};

const log = function(action){
  console.log('store2 INCREMENT', action);
  return action;
};

// reducer，仅用于计算。
function counter(state = {}, action) {
  switch (action.type) {
    case "@@redux/INIT":
      return action.state;
    case "INCREMENT":
      return R.composeP(log, store1.dispatch)({ type: 'ASYNC' });
    default:
      return action.state;
  }
}

let store = createStore(counter);

store.subscribe(function(){
  let reduxState = store.getState();
  reduxState.then(function(state){
    let reactState = store.getReactState();
    store.trigger(
      R.merge(reactState, state)
    )
  });
});

export default store;
