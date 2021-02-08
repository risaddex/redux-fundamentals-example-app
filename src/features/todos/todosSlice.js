import { client } from "../../api/client"
import { createSelector } from 'reselect'
// cuidado ao importar um slice de outro, pode causar "cyclic import dependency" e crashar tudo:
// https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns#selectors-with-multiple-arguments
import { StatusFilters } from '../filters/filtersSlice'

const initialState = []

// not needed anymore due to server treatment
// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
//   return maxId + 1
// }
export const todosLoaded = todos => ({ type: 'todos/todosLoaded', payload: todos })
export const todoAdded = todo => ({ type: 'todos/todoAdded', payload: todo })
export const colorFilterChanged = (color, changeType) => (
    {
      type: 'filters/colorFilterChanged',
      payload: { color, changeType }
    }
  )

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
      // omit other reducer cases
    case 'todos/todosLoaded': {
      // Replace the existing state entirely by returning the new value
      return action.payload
    }
    case 'todos/todoAdded': {
      // Can return just the new todos array - no extra object around it
      return [...state, action.payload]
    }
    case 'todos/todoToggled': {
      return state.map((todo) => {
        if (todo.id !== action.payload) {
          return todo
        }

        return {
          ...todo,
          completed: !todo.completed,
        }
      })
    }
    case 'todos/colorSelected': {
      const { color, todoId } = action.payload
      return state.map((todo) => {
        if (todo.id !== todoId) {
          return todo
        }

        return {
          ...todo,
          color,
        }
      })
    }
    case 'todos/todoDeleted': {
      return state.filter((todo) => todo.id !== action.payload)
    }
    case 'todos/allCompleted': {
      return state.map((todo) => {
        return { ...todo, completed: true }
      })
    }
    case 'todos/completedCleared': {
      return state.filter((todo) => !todo.completed)
    }
    default:
      return state
  }
}
// fetchTodosThunk function
export const fetchTodos = () => async dispatch => {

  const response = await client.get('/fakeApi/todos')

  dispatch(todosLoaded(response.todos))
}
// aqui se escreve uma função síncrona  em volta da async
// para que ela consiga enviar o texto recebido depois do cliente adicionar um novo toDo
// export function saveNewTodo(text) {
//   // agora retorna a função assíncrona
//   return async function saveNewTodoThunk(dispatch, getState) {
//     const initialTodo = { text }
//     const response = await client.post('/fakeApi/todos', { todo: initialTodo })
//     dispatch({ type: 'todos/todoAdded', payload: response.todo })
//   }
// }

// arrow function version using anonimous function :)
export const saveNewTodo = (text) => async (dispatch, getState) => {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch(todoAdded(response.todo))
}

export const selectTodos = state => state.todos

export const selectTodoById = (state, todoId) => {
  return selectTodos(state).find(todo => todo.id === todoId)
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
      const statusMatches = 
      showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === colors.includes(todo.color)
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