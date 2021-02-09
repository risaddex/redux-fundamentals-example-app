import { client } from "../../api/client"
import { createSelector, createSlice } from '@reduxjs/toolkit'
// cuidado ao importar um slice de outro, pode causar "cyclic import dependency" e crashar tudo:
// https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#selectors-with-multiple-arguments
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle',
  entities: {}
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      const todo = action.payload
      state.entities[todo.id] = todo
    },
    todoToggled(state, action) {
      const todoId = action.payload
      const todo = state.entities[todoId]
      todo.completed = !todo.completed
    },
    todoColorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload
        state.entities[todoId].color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color }
        }
      }
    },
    todoDeleted(state, action) {
      delete state.entities[action.payload]
    },
    toggleAllCompleted(state, action) {
      Object.values(state.entities).forEach(todo => todo.completed = true)
    },
    clearAllCompleted(state, action) {
      Object.values(state.entities).forEach(todo => {
        if (todo.completed) {
          delete state.entities[todo.id]
        }
      })
    },
    todosLoading(state) {
      state.status = 'loading'
    },
    todosLoaded(state, action) {
      const newEntities = {}
      action.payload.forEach(todo => {
        newEntities[todo.id] = todo
      })
      state.entities = newEntities
      state.status = 'idle'
    } 
  }
})

export const {

  todoAdded,
  todoToggled,
  todoColorSelected,
  todoDeleted,
  toggleAllCompleted,
  clearAllCompleted,
  todosLoading,
  todosLoaded

} = todosSlice.actions

export default todosSlice.reducer

// fetchTodosThunk function
export const fetchTodos = () => async dispatch => {
  dispatch(todosLoading())
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}
// arrow function version using anonimous function for saveNewTodoThunk :)
export const saveNewTodo = (text) => async (dispatch, getState) => {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch(todoAdded(response.todo))
}

const selectTodoEntities = state => state.todos.entities

export const selectTodos = createSelector(selectTodoEntities, entities => Object.values(entities))

export const selectTodoById = (state, todoId) => {
  return selectTodoEntities(state)[todoId]
}
export const selectTodoIds = createSelector(
  selectTodos,
  todos => todos.map(todo => todo.id)
)
export const selectFilteredTodos = createSelector(
  // all toDos:
  selectTodos, 
  // current status filter:
  state => state.filters,
  // output selector - recebe ambos os valores:
  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
  }
    const completedStatus = status === StatusFilters.Completed  
    // retorna ambos os toDos ativos ou completados, baseado no status:
    return todos.filter(todo => {
      const statusMatches = showAllCompletions || todo.completed === completedStatus
      // retorna também baseado no filtro de cor
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return colorMatches && statusMatches  
    })
  }
)
export const selectFilteredTodoIds = createSelector(
  // passar o seletor memoizado como input:
  selectFilteredTodos,
  // e derivar os dados no output:
  filteredTodos => filteredTodos.map(todo => todo.id)
)