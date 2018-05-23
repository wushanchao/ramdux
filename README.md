# ramdux简介
ramdux是redux的魔改版。  
是函数式编程在React组件编写的另一种实现思路。  

# ramdux的思路
每个组件实例有自己的Store实例。  
组件之间的通信通过Store之间的组合来实现。  
`redux的state`默认被Promise。  

# ramdux的API
##### connect
connect把React组件转化成Ramdux组件。  

用法1  
```javascript
import { connect } from 'ramdux';
const RamduxComponent = connect(store)(ReactComponent);
```

用法2
```javascript
import { connect } from 'ramdux';
const RamduxComponent = connect(store,null,'reactStore')(ReactComponent);
```
connect会把store注入到React组件实例的一个属性。默认是`$$store`。  
这里用`reactStore`替代`$$store`。  

##### createStore
创建store的函数。  

```javascript
import { createStore } from 'ramdux';
const reducer = function(){};
const store = createStore(reducer);
store.subscribe(function () {
  let ramduxState = store.getState();
  let reactState = store.getReactState();
  store.trigger({});
})
```
`store.getState()`是获取ramdux的state。返回值是一个`Promise`对象。    
`store.getReactState()`是获取React组件的state。  
`store.trigger({});`调用React组件的`setState`。  

# Demo演示
请点击[这里](https://stackblitz.com/edit/ramdux-demo)  
demo充分展示了如何使用ramdux进行组件状态的异步处理和组件之间的通信。  

# redux所修改的部分
只使用且修改了`3.7.2版本redux`的`createStore.js`文件。  
移除掉里面`replaceReducer,observable`相关部分。  
并修改了dispatch的逻辑，新增了dispatchP方法。  
形成了这个项目自己的`createStore.js`。  

# 待做事项(To Do List)
- 学习借鉴思考  
- 重新优化createStore.js文件  
- 推广并收集实践case  