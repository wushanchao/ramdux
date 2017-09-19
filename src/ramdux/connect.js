import { type, merge } from 'ramda';

const connect = function (listenable, context){
  if (type(listenable) !== 'Object') {
    throw new Error('connect function\'s argument is not a object');
  }

  // const originDispatch = listenable.dispatch;
  const originDispatchP = listenable.dispatchP;
  const originGetState = listenable.getState;
  listenable.trigger = function (obj, fn) {
    this.setState(obj || {}, fn);
  };
  listenable.getReactState = function () {
    return this.state;
  };
  listenable.dispatch = function(obj){
    let state = this.state;
    let dispatchObj = {
      state,
    };
    dispatchObj = merge(dispatchObj, obj);
    return originDispatchP(dispatchObj);
  };

  listenable.getState = function(){
    return Promise.resolve(originGetState());
  };

  return function (otherReactClass) {
    return class baseReactClass extends otherReactClass {
      // constructor() {
      //   super();
      // }
      componentDidMount(...args) {
        // 这里的context就是react组件的上下文了
        context = context || this;
        listenable.trigger = listenable.trigger.bind(context);
        listenable.getReactState = listenable.getReactState.bind(context);
        listenable.dispatch = listenable.dispatch.bind(context);
        super.componentDidMount && super.componentDidMount();
      }
      componentWillUnmount() {
        listenable.trigger = null;
        super.componentWillUnmount && super.componentWillUnmount();
      }

    }
  }
};

export default connect;
