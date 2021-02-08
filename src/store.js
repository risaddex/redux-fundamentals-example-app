// import { print1, print2, print3 } from './exampleAddons/middleware';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducer';

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))
// agora a store pode usar funções do redux-thunk
  const store = createStore(rootReducer, composedEnhancer)

  export default store
