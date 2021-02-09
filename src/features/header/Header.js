import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const dispatch = useDispatch()

  const handleChange = (e) => setText(e.target.value)

  const handleKeyDown = async e => {
    const trimmedText = text.trim()
    // caso o usuário pressionou Enter:
    if (e.which === 13 && trimmedText) {
      // manda um dispatch no novo todo localmente:
      setStatus('loading')
      //--------- agora com REST API && "ACTION CREATOR PATTERN" ----------------
      await dispatch(saveNewTodo(trimmedText))
      // da clear no imput
      setText('')
      setStatus('idle')
    }
  }
  
  let isLoading = status === 'loading'
  let placeholder = isLoading ? '' : 'What needs to be done?'
  let loader = isLoading ? <div className="loader" /> : null

  return (
    <header className="header"> 
      <input
        className="new-todo"
        placeholder={placeholder}
        autoFocus={true}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {loader}
    </header>
  )
}

export default Header
