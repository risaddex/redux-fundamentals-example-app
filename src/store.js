import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { print1, print2, print3 } from './exampleAddons/middleware';
import rootReducer from './reducer';

const composedEnhancer = composeWithDevTools(
  // EXAMPLE: Add whatever middleware you actually want to use here
  applyMiddleware(print1, print2, print3)
  // other store enhancers if any
  )
  // Pass enhancer as the second arg, since there's no preloadedState
  const store = createStore(rootReducer, composedEnhancer)
  
  export default store;

/* // basic store initialization 

let preloadedState;
const persistedTodoString = localStorage.getItem('todos')

if(persistedTodoString) {
    preloadedState = {
    todos: JSON.parse(persistedTodoString)
  }
}

//  ...with composed Enhancers 

import { sayHiOnDispatch, includeMeaningOfLife } from './exampleAddons/enhancers'

const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife)
const store = createStore(rootReducer, undefined, composedEnhancer) */


