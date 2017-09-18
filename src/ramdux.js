import { type, merge } from 'ramda';

const connect = function (listenable, context){
  if (type(listenable) !== 'Object') {
    throw new Error('connect function\'s argument is not a object');
  }
  const originDispatch = listenable.dispatch;
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
    originDispatch(dispatchObj);
  };

  return function (otherReactClass) {
    return class baseReactClass extends otherReactClass {
      // constructor() {
      //   super();
      // }
      componentDidMount(...args) {
        // 这里的context就是组件的上下文了
        context = context || this;
        listenable.trigger = listenable.trigger.bind(context);
        listenable.getReactState = listenable.getReactState.bind(context);
        listenable.dispatch = listenable.dispatch.bind(context);
        super.componentDidMount();
      }
      componentWillUnmount() {
        listenable.trigger = null;
        super.componentWillUnmount();
      }

    }
  }
};

export default connect;
