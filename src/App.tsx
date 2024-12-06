import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from './components/LandingPage';
import CharacterSelector from './components/CharacterSelector';
import Home from './components/Home';
import FightScene from './components/FightScene';
import TownMap from './components/townMap/TownMap';
import { HomeProvider } from './context/HomeContext';
import PetStore from './components/petStore/PetStore';
import Inventory from './components/inventory/Inventory';
import ItemShop from './components/itemsStore/ItemShop';
import PlayerStateLoader from './components/PlayerStateLoader';
import usePlayerStore from './stores/playerStore';
import useInventoryStore from './stores/inventoryStore';
import InventoryStateLoader from './components/InventoryStateLoader';
import WeaponLoader from './loaders/NewWeaponLoader';
import ItemShopLoader from './components/itemsStore/ItemShopLoader';
import PotionsLoader from './loaders/PotionsLoader';
import ClassLoader from './loaders/ClassLoaders';
import PlayerStats from './components/playerStats/PlayerStats';
import DelayedDisplay from './utils/DelayedDisplayProps';
import { useState, useEffect } from 'react';
import SpellLoader from './loaders/SpellsLoader';
import CreatureLoader from './loaders/CreaturesLoaders';
import MyComponent from './firebase/componenteFireBase.js'
import TestFirebaseRead from './firebase/TestFirebaseRead.js';
import PlayerStateSaver from './firebase/savePlayerStateToFirebase .js';
import LoadPlayerFromFirebase from './firebase/loadPlayerState.js';
function App() {
  const { player } = usePlayerStore();
  const { inventories } = useInventoryStore();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const audio = document.getElementById('background-music') as HTMLAudioElement; // Casting explícito
    if (isMusicPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    return () => {
      audio.pause();
    };
  }, [isMusicPlaying]);

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('playerState', JSON.stringify(player));
    localStorage.setItem('inventoryState', JSON.stringify(inventories));
  });

  return (
    <BrowserRouter>
      <PlayerStateLoader />
      <WeaponLoader />
      <PotionsLoader />
      <ClassLoader />
      <SpellLoader/>
      <CreatureLoader/>
      <ItemShopLoader />
      <InventoryStateLoader />
      <PlayerStateSaver />
      <HomeProvider>
     
        <div className="music-controls">
          <button onClick={() => setIsMusicPlaying(!isMusicPlaying)}>
            {isMusicPlaying ? '🔊' : '🔈'}
          </button>
        </div>
        <audio id="background-music" loop>
          <source src="/music/medieval-ambient.mp3" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>

        {/* Aplicamos DelayedDisplay a todas las rutas */}
        <DelayedDisplay delay={300} duration={200}>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/characterSelector" element={<CharacterSelector />} />
            <Route path="/home" element={<Home />} />
            <Route path="/fightScene" element={<FightScene />} />
            <Route path="/townMap" element={<TownMap />} />
            <Route path="/petStore" element={<PetStore />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/itemShop" element={<ItemShop />} />
            <Route path="/playerstats" element={<PlayerStats />} />
            <Route path="/firebase" element={< MyComponent />} />
            <Route path="/testread" element={< TestFirebaseRead />} />
            <Route path="/loadPlayer/:playerName" element={<LoadPlayerFromFirebase />} />
            
          </Routes>
        </DelayedDisplay>
      </HomeProvider>
    </BrowserRouter>
  );
}

export default App;

