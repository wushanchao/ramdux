import React from 'react';
import ReactDOM from 'react-dom';
import ramdux  from './ramdux.js';
import store from './store.js';
import Index2 from './index2.js';

class ReactComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      otherNum: 0,
      asyncing: false,
      otherAsyncing: false,
    };
  }
  setOtherData() {
    store.dispatch({ type: 'Other' });
  }
  setData() {
   store.dispatch({ type: 'INCREMENT' });
  }
  async() {
    store.dispatch({ type: 'Loading' });
    console.log('async',store.dispatch({ type: 'ASYNC' }).then(function(data){console.log('async data', data)}));
  }
  otherAsync(){
    store.dispatch({
      type: 'OtherAsync'
    });
  }
  render() {
    const t = this;
    const { value, asyncing, otherNum } = t.state;
    return (
      <div>
        <div>数字：{value}</div>
        <div onClick={t.setData.bind(this)}>点我+1</div>
        {
          (() => {
            if (asyncing) {
              return (<div>异步加载中</div>);
            }
            else {
              return (<div onClick={t.async.bind(t)}>点我异步+10</div>);
            }
          })()
        }
        <br />
        <div>其他数字：{otherNum}</div>
        <div onClick={t.setOtherData.bind(this)}>点我其他数字+1</div>
        <div onClick={t.otherAsync.bind(this)}>点我其他数字异步+10</div>
        <br />
        <Index2 />
      </div>);
  }
}
const RamduxComponent = ramdux(store)(ReactComponent);

ReactDOM.render(
  <RamduxComponent />,
  document.getElementById('app')
)

export default RamduxComponent;