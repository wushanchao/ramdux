// import {createStore} from "redux";
import createStore from "./createStore.js";
import R from "ramda";

const setTimeout1 = R.curry(function(action) {
  let state = action.state;
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({
        value: state.value + 10,
        asyncing : false
      });
    }, 3000);
  });
});


const INCREMENT = function(action){
  let state = action.state;
  return {
    value : state.value + 1
  };
};

const Loading = function(action){
  return {
    asyncing: true
  };
};

const other = function(action){
  let state = action.state;
  return {
    otherNum : state.otherNum + 1
  };
};

const OtherAsync = function(action){
  let state = action.state;
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({
        otherNum: state.otherNum + 10,
        otherAsyncing : false
      });
    }, 1000);
  });
};

const otherLoading = function(action){
  return {
    otherAsyncing: true
  };
};

// reducer，仅用于计算。
function counter(state = {}, action) {
  switch (action.type) {
    case "@@redux/INIT":
      return action.state;
    case "INCREMENT":
      return R.compose(INCREMENT)(action);
    case "ASYNC":
      return R.composeP( setTimeout1)(action);
    case "Loading":
      return R.compose(Loading)(action);
    case "Other":
      return R.compose(other)(action);
    case "OtherLoading":
      return R.compose(otherLoading)(action);
    case "OtherAsync":
      return R.composeP(OtherAsync)(action);
    default:
      return action.state;
  }
}

let store = createStore(counter);

store.subscribe(function(){
  let reduxState = store.getState();
  // 因为不知reduxState是Promise对象或者普通对象，
  // 普通对象其转为Promise对象。本身为Promise对象则不转。
  reduxState.then(function(state){
    let reactState = store.getReactState();
    // console.log('Promise.resolve', state, reactState);
    store.trigger(
      R.merge(reactState, state)
    )
  });
});

export default store;
