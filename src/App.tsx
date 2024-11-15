// import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from './components/LandingPage'
import CharacterSelector from './components/CharacterSelector'
import Home from './components/Home';

import FightScene from './components/FightScene';
import TownMap from './components/TownMap';
import { HomeProvider } from './context/HomeContext';
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <HomeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/characterSelector" element={<CharacterSelector/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/fightScene" element={<FightScene/>}/>
     
            <Route path="/townMap" element={<TownMap/>}/>
      
      </Routes>
      </HomeProvider>
    </BrowserRouter>

    </>
  )
}

export default App
