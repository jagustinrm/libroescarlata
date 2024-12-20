import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import InventoryStateLoader from './components/InventoryStateLoader';
import WeaponLoader from './loaders/NewWeaponLoader';
import PotionsLoader from './loaders/PotionsLoader';
import ClassLoader from './loaders/ClassLoaders';
import PlayerStats from './components/playerStats/PlayerStats';
import DelayedDisplay from './utils/DelayedDisplayProps';
import SpellLoader from './loaders/SpellsLoader';
import CreatureLoader from './loaders/CreaturesLoaders';
import MyComponent from './firebase/componenteFireBase.js';
import TestFirebaseRead from './firebase/TestFirebaseRead.js';
import PlayerStateSaver from './firebase/savePlayerStateToFirebase .js';
import LoadPlayerFromFirebase from './firebase/loadPlayerState.js';
import ArmorsLoader from './loaders/ArmorsLoader.js';
import Particles from './components/UI/details/particles.js';
import ItemShopLoader from './components/itemsStore/ItemShopLoader.js';
import Chat from './components/IA/chat.js';
import StoryMode from './components/storyMode/StoryMode.js';
import StoryLoader from './loaders/StoryLoader.js';
import Chapter from './components/storyMode/Chapter.js';
import DialogLoader from './loaders/DialogLoader.js';
import HeaderMenu from './components/UI/menu/HeaderMenu.js';
import useGlobalState from './customHooks/useGlobalState.js';

function App() {
  const {player, inventories } = useGlobalState();
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('playerState', JSON.stringify(player));
    localStorage.setItem('inventoryState', JSON.stringify(inventories));
  });

  return (
    <BrowserRouter>
      <Particles />
      <PlayerStateLoader />
      <WeaponLoader />
      <ArmorsLoader />
      <PotionsLoader />
      <ClassLoader />
      <SpellLoader />
      <CreatureLoader />
      <ItemShopLoader />
      <DialogLoader/>
      <StoryLoader/>
      <PlayerStateSaver />
      <InventoryStateLoader />
      <HomeProvider>
        <HeaderMenu/>
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
          <Route path="/firebase" element={<MyComponent />} />
          <Route path="/storyMode" element={< StoryMode />} />
          <Route path="/chapter" element={< Chapter />} />
          <Route path="/testread" element={<TestFirebaseRead />} />
          <Route path="/loadPlayer/:playerName" element={<LoadPlayerFromFirebase />}/>
          <Route path="/chat" element={<Chat/>} />
        </Routes>
        </DelayedDisplay>
      </HomeProvider>
    </BrowserRouter>
  );
}

export default App;
