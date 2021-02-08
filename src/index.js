import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'

import './api/server'

import store from './store'
import { fetchTodos } from './features/todos/todosSlice'

store.dispatch(fetchTodos)

ReactDOM.render(
  // passar o <Provider /> ao redor do <App />
  // e passar a store como prop:
  <React.StrictMode>
    <Provider store={store}>
     <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

  // store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
  // log: 'Hi!'
  
  // console.log('State after dispatch: ', store.getState())
  // log: {todos: [...], filters: {status, colors}, meaningOfLife: 42}
  // console.log('Dispatching action')
  // store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
  // console.log('Dispatch complete')
  
  // console.log('Initial state: ', store.getState())
  
  // const unsubscribe = store.subscribe(() => 
  //   console.log('State after dispatch: ', store.getState())
  // )
  
  // store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
  // store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about reducers' })
  // store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about stores' })
  
  // store.dispatch({ type: 'todos/todoToggled', payload: 0 })
  // store.dispatch({ type: 'todos/todoToggled', payload: 1 })
  
  // store.dispatch({ type: 'filters/statusFilterChanged', payload: 'Active' })
  
  // store.dispatch({
  //   type: 'filters/colorFilterChanged',
  //   payload: { color: 'red', changeType: 'selected' }
  // })
  
  // unsubscribe()
  
  // store.dispatch({ type: 'todos/todoAdded', payload: 'Try creating a store' })
