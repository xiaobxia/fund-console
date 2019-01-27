import {createStore, applyMiddleware, bindActionCreators} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger'
import globReducers from './reducers';

let middleware = [thunkMiddleware];
// 不是发布环境就打印
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

const store = createStoreWithMiddleware(globReducers);
console.log('create store success', store.getState());

export default store;
