import React from 'react'
import { useSelector } from 'react-redux'
import TodoListItem from './TodoListItem'
import { selectFilteredTodoIds } from './todosSlice'

// const selectTodoIds = state => state.todos.map(todo => todo.id) //seleciona os ids ao inves da lista toda

const TodoList = () => {
  const todoIds = useSelector(selectFilteredTodoIds)
  //agora cara elemento terá um id único
  const renderedListItems = todoIds.map((todo) => {
    return <TodoListItem key={todo} id={todo} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
