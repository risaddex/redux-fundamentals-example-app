import { client } from "../../api/client"
import { createSelector } from 'reselect'
// cuidado ao importar um slice de outro, pode causar "cyclic import dependency" e crashar tudo:
// https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#selectors-with-multiple-arguments
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle',
  entities: {}
}

// not needed anymore due to server treatment
// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
//   return maxId + 1
// }
export const todosLoaded = todos => ({ type: 'todos/todosLoaded', payload: todos })
export const todoAdded = todo => ({ type: 'todos/todoAdded', payload: todo })
export const todosLoading = todos => ({ type: 'todos/todosLoading', payload: todos })
export const colorFilterChanged = (color, changeType) => (
    {
      type: 'filters/colorFilterChanged',
      payload: { color, changeType }
    }
  )

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      const todo = action.payload
      return {
        ...state,
        entities: {
          ...state.entities,
          [todo.id]: todo
        }
      }
    }
    case 'todos/todoToggled': {
      const todoId = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            completed: !todo.completed
          }
        }
      }
    }
    case 'todos/colorSelected': {
      const { color, todoId } = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            color
          }
        }
      }
    }
    case 'todos/todoDeleted': {
      const newEntities = { ...state.entities }
      delete newEntities[action.payload]
      return {
        ...state,
        entities: newEntities
      }
    }
    case 'todos/allCompleted': {
      const newEntities = { ...state.entities }
      Object.values(newEntities).forEach(todo => {
        newEntities[todo.id] = {
          ...todo,
          completed: true
        }
      })
      return {
        ...state,
        entities: newEntities
      }
    }
    case 'todos/completedCleared': {
      const newEntities = { ...state.entities }
      Object.values(newEntities).forEach(todo => {
        if (todo.completed) {
          delete newEntities[todo.id]
        }
      })
      return {
        ...state,
        entities: newEntities
      }
    }
    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading'
      }
    }
    case 'todos/todosLoaded': {
      const newEntities = {}
      action.payload.forEach(todo => {
        newEntities[todo.id] = todo
      })
      return {
        ...state,
        status: 'idle',
        entities: newEntities
      }
    }
    default:
      return state
  }
}
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