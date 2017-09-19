# ramdux简介
ramdux是ramdajs和redux的结合。  
目标是成为一款编码体验更一致的前端数据流框架。  
一致体现在:  
- 修改state的过程函数式化。  
函数式化的优势是，通过`组合`来复用代码比`继承/合并/中间件`更简单更灵活。
- 明确`React组件的state`和`redux的state`关系。  
进一步弱化`redux的state`作用。  
`redux的state`只是用来描述`React组件的state`改变的部分。  
在reducer中，几乎用不到`redux的state`。  

# 三大原则
- 非单一数据源  
世界是混沌的。  
随着业务的复杂度增加，一个应用一个Store的维护会越来越困难，也越难预测业务行为。  
所以一个组件一个Store，约定好Store之间的通信协议，组件之间的通信通过Store之间的消息传递即可。   
- State 是只读的
- 使用纯函数来执行修改

# Demo演示
本项目Demo的脚手架采用create-react-app。  
```
npm install 
npm start
```

# Get Start
### 0.创建Store  
- 在reducer中，我们基本不会用到`redux的state`，而是使用React组件传递过来的`action.state`。  
`action.state`就是`React组件的state`。  
- 在`store.subscribe`中，我们对`redux的state`进行了`Promise.resolve`处理。  
- 新增了`store.getReactState`和`store.trigger`两个方法。  
一个用来获取组建的state，一个用来对组件进行setState。  

```javascript
import {createStore} from "redux";
import R from "ramda";

const INCREMENT = function(action){
  let state = action.state;
  return {
    value : state.value + 1
  };
};

function counter(state = {}, action) {
  switch (action.type) {
    case "@@redux/INIT":
      return action.state;
    case "INCREMENT":
      return R.compose(INCREMENT)(action);
    default:
      return action.state;
  }
}

let store = createStore(counter);
store.subscribe(function(action){
  let reduxState = store.getState();
  // 因为不知reduxState是Promise对象或者普通对象，
  // 普通对象其转为Promise对象。本身为Promise对象则不转。
  Promise.resolve(reduxState).then(function(state){
    let reactState = store.getReactState();
    console.log('Promise.resolve', state, reactState);
    store.trigger(
      R.merge(reactState, state)
    )
  });
});


export default store;
```


### 1.把store注入React组件  
修改了`store.dispatch`功能，自动把`组件的state`放入`aciton.state`中。  

```javascript
import ramdux  from './ramdux.js';
import React from 'react';
import store from './store.js';

class ReactComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: 0,
    };
  }
  setData() {
    store.dispatch({ type: 'INCREMENT' });
  }
  render() {
    const t = this;
    const { value } = t.state;
    return (
      <div>
        <div>数字：{value}</div>
        <div onClick={t.setData.bind(t)}>点我+1</div>
      </div>
    )
  }
}
const RamduxComponent = ramdux(store)(ReactComponent);
export default RamduxComponent;
```

3. 异步操作可以看demo  
组件之间的通信，通过引入对方的store，调用其`store.getReactState`获取状态。  

# 待做事项(To Do List)
- 阅读redux中`createStore`方法的源码。
- 重写更适合本项目的`createStore`方法。  
- 探索组件之间更好的通信协议。  