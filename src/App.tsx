import './App.css'
import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Main from './Main'
import Info from './Info'

function App() {
  const [practice, setPractice] = useState(true)
  const [chars, setChars] = useState([])

  useEffect(() => {
    Axios.get("https://hanziiseasyserver-production.up.railway.app/").then(res => setChars(res.data))
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <nav className="navbar">
          <Link to="/" style={{opacity: practice ? "1" : "0.5", pointerEvents: practice ? "none" : "auto"}} onClick={() => setPractice(true)}>Practice</Link>
          <Link to="/info" style={{opacity: practice ? "0.5" : "1", pointerEvents: practice ? "auto" : "none"}} onClick={() => setPractice(false)}>Info</Link>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/" element={<Main chars={chars}/>} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
