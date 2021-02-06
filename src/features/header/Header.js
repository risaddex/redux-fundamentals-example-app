import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

const Header = () => {
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  const handleChange = (e) => setText(e.target.value)
  const handleKeyDown = e => {
    const trimmedText = e.target.value.trim()
    // caso o usuário pressionou Enter:
    if (e.which === 13 && trimmedText) {
      // manda um dispatch no novo todo:
      dispatch({ type: 'todos/todoAdded', payload: trimmedText })
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
