import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  const handleChange = (e) => setText(e.target.value)
  const handleKeyDown = e => {
    const trimmedText = e.target.value.trim()
    // caso o usuário pressionou Enter:
    if (e.which === 13 && trimmedText) {
      // manda um dispatch no novo todo localmente:
      // dispatch({ type: 'todos/todoAdded', payload: trimmedText })
      //--------- agora com REST API && "ACTION CREATOR PATTERN" ----------------
      dispatch(saveNewTodo(trimmedText))
      // da clear no imput
      setText('')
    }
  }

  return (
    <header className="header"> 
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus={true}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </header>
  )
}

export default Header
