import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage.js';
import CharacterSelector from './components/CharacterSelector';
import Home from './components/home/Home.js';
import FightScene from './components/FightScene/FightScene.js';
import PetStore from './components/petStore/PetStore';
import Inventory from './components/inventory/Inventory';
import ItemShop from './components/itemsStore/ItemShop';
import PlayerStateLoader from './loaders/PlayerStateLoader.js';
import InventoryStateLoader from './loaders/InventoryStateLoader.js';
import WeaponLoader from './loaders/NewWeaponLoader';
import PotionsLoader from './loaders/PotionsLoader';
import ClassLoader from './loaders/ClassLoaders';
import PlayerStats from './components/playerStats/PlayerStats';
import DelayedDisplay from './utils/DelayedDisplayProps';
import SpellLoader from './loaders/SpellsLoader';
import CreatureLoader from './loaders/CreaturesLoaders';
import PlayerStateSaver from './firebase/savePlayerStateToFirebase .js';
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
import OtherItemsLoader from './loaders/OtherItemsLoader.js';
import Bestiary from './components/bestiary/Bestiary.js';
import QuestLoader from './loaders/QuestsLoader.js';
import BooksLoader from './loaders/BooksLoader.js';
import SummonLoader from './loaders/SummonLoader.js';
import PetsLoader from './loaders/PetsLoader.js';

function App() {
  const { player, inventories } = useGlobalState();

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('playerState', JSON.stringify(player));
    localStorage.setItem('inventoryState', JSON.stringify(inventories));
  });

  return (
    <BrowserRouter>
      <Particles />
      <PlayerStateLoader />
      <OtherItemsLoader />
      <WeaponLoader />
      <ArmorsLoader />
      <PetsLoader />
      <PotionsLoader />
      <ClassLoader />
      <SpellLoader />
      <QuestLoader />
      <SummonLoader />
      <BooksLoader />
      <CreatureLoader />
      <ItemShopLoader />
      <DialogLoader />
      <StoryLoader />
      <PlayerStateSaver />
      <InventoryStateLoader />
      <HeaderMenu />
      <DelayedDisplay delay={300} duration={200}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/characterSelector" element={<CharacterSelector />} />
          <Route path="/home" element={<Home />} />
          <Route path="/fightScene" element={<FightScene />} />
          <Route path="/petStore" element={<PetStore />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/itemShop" element={<ItemShop />} />
          <Route path="/playerstats" element={<PlayerStats />} />
          <Route path="/storyMode" element={<StoryMode />} />
          <Route path="/chapter" element={<Chapter />} />
          <Route path="/bestiary" element={<Bestiary />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </DelayedDisplay>
    </BrowserRouter>
  );
}

export default App;
