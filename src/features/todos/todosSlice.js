import { client } from "../../api/client"

const initialState = []

// not needed anymore due to server treatment
// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
//   return maxId + 1
// }

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
      // omit other reducer cases
    case 'todos/todosLoaded': {
      // Replace the existing state entirely by returning the new value
      return action.payload
    }

    case 'todos/todoAdded': {
      // Can return just the new todos array - no extra object around it
      return [
        ...state, action.payload
        // {
        //   id: nextTodoId(state),
        //   text: action.payload,
        //   completed: false,
        // },
      ]
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

// Thunk function
export async function fetchTodos(dispatch, getState) {

  const stateBefore = getState()
  console.log('Todos before dispatch: ', stateBefore.todos.length)
  
  const response = await client.get('/fakeApi/todos')
  dispatch({ type: 'todos/todosLoaded', payload: response.todos })

  const stateAfter = getState()
  console.log('Todos before dispatch: ', stateAfter.todos.length)
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
    dispatch({ type: 'todos/todoAdded', payload: response.todo })
}