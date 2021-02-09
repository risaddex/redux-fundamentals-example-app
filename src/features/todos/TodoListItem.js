import React from 'react'
import { useSelector, useDispatch,  } from 'react-redux'

import { ReactComponent as TimesSolid } from './times-solid.svg'

import { availableColors, capitalize } from '../filters/colors'
import { selectTodos, todoColorSelected, todoDeleted, todoToggled } from './todosSlice'

const selectTodoById = (state, todoId) => {
  return selectTodos(state).find(todo => todo.id === todoId)
}
// destructure no Id apenas
const TodoListItem = ({ id }) => {
  // chama o `selectedById` com o STATE e o ID
  const todo = useSelector(state => selectTodoById(state, id))
  const { text, completed, color } = todo

  const dispatch = useDispatch()
  
  const handleCompletedChanged = () => dispatch(todoToggled(todo.id))
  
  const handleColorChanged = (e) => dispatch(todoColorSelected(todo.id, e.target.value))

  const onDelete = () => {
    dispatch(todoDeleted(todo.id))
  }

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ))

  return (
    <li>
      <div className="view">
        <div className="segment label">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleCompletedChanged}
          />
          <div className="todo-text">{text}</div>
        </div>
        <div className="segment buttons">
          <select
            className="colorPicker"
            value={color}
            style={{ color }}
            onChange={handleColorChanged}
          >
            <option value=""></option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={onDelete}>
            <TimesSolid />
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoListItem
