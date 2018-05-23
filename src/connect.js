import { type, merge } from './utils.js';

const connect = function (listenable, outerContext, storeName) {


  return function (otherReactClass) {
    return class baseReactClass extends otherReactClass {
      constructor(props) {
        super(props);
      }
      componentDidMount(...args) {
        // 这里的context就是react组件的上下文了
        
        let store = listenable();
        console.log('listenable',listenable,store);
        let context = outerContext || this;

        const originDispatchP = store.dispatchP;
        const originGetState = store.getState;

        store.trigger = function (obj, fn) {
          context.setState(obj || {}, fn);
        };
        store.getReactState = function () {
          return context.state;
        };
        store.dispatch = function (obj) {
          let state = context.state;
          let dispatchObj = {
            state,
          };
          dispatchObj = merge(dispatchObj, obj);
          return originDispatchP(dispatchObj);
        };
        store.getState = function () {
          return Promise.resolve(originGetState());
        };
        if(storeName){
          context[storeName] = store;
        }
        else{
          context.$$store = store;
        }
        
        super.componentDidMount && super.componentDidMount();
      }
      componentWillUnmount() {
        this.store = null;
        super.componentWillUnmount && super.componentWillUnmount();
      }

    }
  }
};

export default connect;