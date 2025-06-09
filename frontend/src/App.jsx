import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'
import About from './pages/About'

function App() {
  // Add state for selected map type
  const [selectedMap, setSelectedMap] = useState('sample');

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Dashboard selectedMap={selectedMap} setSelectedMap={setSelectedMap} />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
