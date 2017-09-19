# ramdux简介
ramdux是ramdajs和redux(改造过)的结合。  
目标是成为一款编码体验更一致的前端数据流框架。  
一致体现在:  
- 修改state的过程函数式化。  
函数式化的优势是，通过`组合`来复用代码比`继承/合并/中间件`更简单更灵活。
- 明确`React组件的state`和`redux的state`关系。  
进一步弱化`redux的state`作用。  
`redux的state`只是用来描述`React组件的state`改变的部分。  
在reducer中，几乎用不到`redux的state`。  
- `redux的state`经过Promise化。这样保持了同步异步处理的一致性。

# 三大原则
- 非单一数据源  
世界是混沌的。  
随着业务的复杂度增加，一个应用一个Store的维护会越来越困难，也越难预测业务行为。  
所以一个组件一个Store，约定好Store之间的通信协议，组件之间的通信通过Store之间的消息传递即可。   
- State 是只读的
- 使用纯函数来执行修改


# Get Start
### 0.创建Store  
- 在reducer中，我们基本不会用到`redux的state`，而是使用React组件传递过来的`action.state`。  
`action.state`就是`React组件的state`。  
- 新增了`store.getReactState`和`store.trigger`两个方法。  
一个用来获取组件的state，一个用来对组件进行setState。  
- 改造了`store.getState`。
返回的是Promise化的`redux的state`。


```javascript
import {createStore} from './ramdux/index.js';
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
  // 返回的是Promise化的`redux的state`
  reduxState.then(function(state){
    let reactState = store.getReactState();
    store.trigger(
      R.merge(reactState, state)
    )
  });
});

export default store;
```


### 1.把store注入React组件  
改造了`store.dispatch`功能，自动把`组件的state`放入`aciton.state`中。   
并且返回Reducer处理后，并Promise化的数据。  

```javascript
import React from 'react';
import {connect} from './ramdux/index.js';
import store from './store.js';

class ReactComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: 0,
    };
  }
  setData() {
    console.log('dispatch的返回值是一个Promise对象' ,store.dispatch({ type: 'INCREMENT' }));
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

### 2. 异步操作可以看demo  
组件之间的通信，通过引入对方的store，调用其`store.dispatch`方法获取返回值即可。  
因为都做过Promise化处理，同步异步都方便。

# Demo演示
本项目Demo的脚手架采用create-react-app。  
```
npm install 
npm start
```

# 待做事项(To Do List)
- 学习借鉴思考