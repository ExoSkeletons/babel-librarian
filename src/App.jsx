import './App.css'
import { Routes, Route } from 'react-router-dom'

import { Desk } from './pages/Desk'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Desk />} />
    </Routes>
  )
}

export default App