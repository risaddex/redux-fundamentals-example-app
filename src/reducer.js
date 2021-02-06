import { combineReducers } from 'redux';

import filtersReducer from "./features/filters/filtersSlice";
import todosReducer from "./features/todos/todosSlice";

const rootReducer = combineReducers({
  todos: todosReducer,
  filters: filtersReducer
})

export default rootReducer;
/* const rootReducer = (state = {}, action) => ({

  todos: todosReducer(state.todos, action),
  filters: filtersReducer(state.filters, action)
  
});
*/
