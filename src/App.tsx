// import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from './components/LandingPage'
import CharacterSelector from './components/CharacterSelector'
import Home from './components/Home';

import FightScene from './components/FightScene';
import TownMap from './components/TownMap';
import { HomeProvider, InventoryProvider } from './context/HomeContext';
import PetStore from './components/petStore/PetStore'
import Inventary from './components/inventary/Inventary';

function App() {

  return (
    <>
    <BrowserRouter>
    <InventoryProvider>
    <HomeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/characterSelector" element={<CharacterSelector/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/fightScene" element={<FightScene/>}/>
        <Route path="/townMap" element={<TownMap/>}/>
        <Route path="/petStore" element={<PetStore/>}/>
        <Route path="/inventary" element={<Inventary/>}/>
      </Routes>
      </HomeProvider>
      </InventoryProvider>
    </BrowserRouter>

    </>
  )
}

export default App
