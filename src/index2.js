import React from 'react';
import ramdux  from './ramdux.js';
import store from './store2.js';

class ReactComponent extends React.Component {
    setData() {
        store.dispatch({ type: 'INCREMENT' });
    }
    render(){
        return(
            <div onClick={this.setData}>哈哈 我是第二个组件</div>
        )
    }    
}

const RamduxComponent = ramdux(store)(ReactComponent);
export default RamduxComponent;
