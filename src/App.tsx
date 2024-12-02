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
// import Quests from './components/quests/Quests';
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

function App() {
  const {player} = usePlayerStore();
  const {inventories} = useInventoryStore();
  
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('playerState', JSON.stringify(player));
    localStorage.setItem('inventoryState', JSON.stringify(inventories))
});
// window.addEventListener('load', () => {
//     localStorage.removeItem('playerState')
//     localStorage.removeItem('inventoryState')

// });
  return (
    
    <BrowserRouter>
      <PlayerStateLoader />
      <WeaponLoader/>
      <PotionsLoader/>
      <ClassLoader/>
      <ItemShopLoader/>
      <InventoryStateLoader/>
      <HomeProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/characterSelector" element={<CharacterSelector />} />
          <Route path="/home" element={<Home />} />
          <Route path="/fightScene" element={<FightScene />} />
          <Route path="/townMap" element={<TownMap />} />
          <Route path="/petStore" element={<PetStore />} />
          <Route path="/inventory" element={<Inventory />} />
          {/* <Route path="/quests" element={<Quests />} /> */}
          <Route path="/itemShop" element={<ItemShop/>} />
          <Route path="/playerStats" element={<PlayerStats/>} />
        </Routes>
      </HomeProvider>
    </BrowserRouter>
  );
}

export default App;

