import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import TodoListItem from './TodoListItem'

const selectTodoIds = state => state.todos.map(todo => todo.id) //seleciona os ids ao inves da lista toda

const TodoList = () => {
  const todoIds = useSelector(selectTodoIds, shallowEqual)
  //agora cara elemento terá um id único

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
