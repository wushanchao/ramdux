import React from 'react';
import store from './store2.js';
import {connect} from './ramdux/index.js';

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

const RamduxComponent = connect(store)(ReactComponent);
export default RamduxComponent;
