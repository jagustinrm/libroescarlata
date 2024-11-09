// import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from './components/LandingPage'
import CharacterSelector from './components/CharacterSelector'
import Home from './components/Home';

import FightScene from './components/FightScene';
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/characterSelector" element={<CharacterSelector/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/fightScene" element={<FightScene/>}/>
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
