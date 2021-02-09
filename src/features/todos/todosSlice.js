import { client } from "../../api/client"
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
// cuidado ao importar um slice de outro, pode causar "cyclic import dependency" e crashar tudo:
// https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#selectors-with-multiple-arguments
import { StatusFilters } from '../filters/filtersSlice'

const todosAdapter = createEntityAdapter()

const initialState = todosAdapter.getInitialState({
  status: 'idle'
})
// Thunks
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos')
  return response.todos
})

export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async text => {
  const initialTodo = { text }
  const response = await client.post('/fakeApi/todos', { todo: initialTodo })
  return response.todo
})
// Reducer
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
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
    todoDeleted: todosAdapter.removeOne,

    toggleAllCompleted(state, action) {
      Object.values(state.entities).forEach(todo => todo.completed = true)
    },
    clearAllCompleted(state, action) {
      const completedIds = Object.values(state.entities)
        .filter(todo => todo.completed)
        .map(todo => todo.id)
      // Use an adapter function as a "mutating" update helper
      todosAdapter.removeMany(state, completedIds)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        todosAdapter.setAll(state, action.payload)
        state.status = 'idle'
      })
      // Use another adapter function as a reducer to add a todo
      .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
  }

})

export const {

  todoAdded,
  todoToggled,
  todoColorSelected,
  todoDeleted,
  toggleAllCompleted,
  clearAllCompleted

} = todosSlice.actions

export default todosSlice.reducer

export const {
  selectAll: selectTodos,
  selectById: selectTodoById
} = todosAdapter.getSelectors(state => state.todos)

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