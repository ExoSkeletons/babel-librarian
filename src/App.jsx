import './App.css'
import { Routes, Route } from 'react-router-dom'

import { Desk } from './pages/Desk'
import { RoomsMap } from './pages/RoomsMap'
import { Room } from './pages/Room'
import { WallPage } from './pages/WallPage'
import { Book } from './pages/Book'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Desk />} />
      <Route path="/desk" element={<Desk />} />
      <Route path="/librarian" element={<Desk />} />
      
      <Route path="/browse" element={<RoomsMap />} />
      <Route path="/browse/:room" element={<Room />} />
      <Route path="/browse/:room/:wall" element={<WallPage />} />
      <Route path="/browse/:room/:wall/:book" element={<Book />} />
      <Route path="/browse/:room/:wall/:book/:page" element={<Book />} />
    </Routes>
  )
}

export default App