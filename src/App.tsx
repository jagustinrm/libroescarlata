import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from './components/LandingPage';
import CharacterSelector from './components/CharacterSelector';
import Home from './components/Home';

import FightScene from './components/FightScene';
import TownMap from './components/TownMap';
import { HomeProvider } from './context/HomeContext';
import PetStore from './components/petStore/PetStore';
import Inventory from './components/inventory/Inventory';
import Quests from './components/quests/Quests';

function App() {
  return (
    <BrowserRouter>
      <HomeProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/characterSelector" element={<CharacterSelector />} />
          <Route path="/home" element={<Home />} />
          <Route path="/fightScene" element={<FightScene />} />
          <Route path="/townMap" element={<TownMap />} />
          <Route path="/petStore" element={<PetStore />} />
          <Route path="/inventary" element={<Inventory />} />
          <Route path="/quests" element={<Quests />} />
        </Routes>
      </HomeProvider>
    </BrowserRouter>
  );
}

export default App;

