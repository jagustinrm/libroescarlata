import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage.js';
import CharacterSelector from './components/CharacterSelector';
import Home from './components/home/Home.js';
import FightScene from './components/FightScene/FightScene.js';
import PetStore from './components/petStore/PetStore';
import Inventory from './components/inventory/Inventory';
import ItemShop from './components/itemsStore/ItemShop';
import PlayerStats from './components/playerStats/PlayerStats';
import Chat from './components/IA/chat.js';
import StoryMode from './components/storyMode/StoryMode.js';
import Chapter from './components/storyMode/Chapter.js';
import PlayerStateLoader from './loaders/PlayerStateLoader.js';
import InventoryStateLoader from './loaders/InventoryStateLoader.js';
import WeaponLoader from './loaders/NewWeaponLoader';
import PotionsLoader from './loaders/PotionsLoader';
import ClassLoader from './loaders/ClassLoaders';

import DelayedDisplay from './utils/DelayedDisplayProps';
import SpellLoader from './loaders/SpellsLoader';
import CreatureLoader from './loaders/CreaturesLoaders';
import PlayerStateSaver from './firebase/savePlayerStateToFirebase .js';
import ArmorsLoader from './loaders/ArmorsLoader.js';
import Particles from './components/UI/details/particles.js';
import ItemShopLoader from './components/itemsStore/ItemShopLoader.js';

import StoryLoader from './loaders/StoryLoader.js';

import DialogLoader from './loaders/DialogLoader.js';
import HeaderMenu from './components/UI/menu/HeaderMenu.js';
import useGlobalState from './customHooks/useGlobalState.js';
import OtherItemsLoader from './loaders/OtherItemsLoader.js';
import Bestiary from './components/bestiary/Bestiary.js';
import QuestLoader from './loaders/QuestsLoader.js';
import BooksLoader from './loaders/BooksLoader.js';
import SummonLoader from './loaders/SummonLoader.js';
import PetsLoader from './loaders/PetsLoader.js';

import { useMemo } from 'react';
import { useImagePreloader } from './customHooks/useImagePreloader';
import { GlobalLoadingScreen } from './components/UI/GlobalLoadingScreen';

function App() {
  const globalState = useGlobalState();
  const { player, inventories, weapons, creatures, armors, pets, items } = globalState;

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('playerState', JSON.stringify(player));
    localStorage.setItem('inventoryState', JSON.stringify(inventories));
  });

  // Recopilar URLs de imágenes del estado global
  const imageUrlsToPreload = useMemo(() => {
    const urls: string[] = [];

    // Avatar y clase del jugador
    if (player.avatarImg) urls.push(player.avatarImg);
    if (player.classImg) urls.push(player.classImg);

    // Armas
    if (weapons) weapons.forEach(w => w.img && urls.push(w.img));

    // Armaduras
    if (armors) armors.forEach(a => a.img && urls.push(a.img));

    // Criaturas y Jefes
    if (creatures) creatures.forEach(c => c.img && urls.push(c.img));

    // Mascotas
    if (pets) pets.forEach(p => p.img && urls.push(p.img));

    // Items generales (items es Record<string, Items>)
    if (items) {
      Object.values(items).forEach((invItems) => {
        if (invItems) {
          Object.values(invItems).forEach((itemArray) => {
            if (Array.isArray(itemArray)) {
              itemArray.forEach(i => i && i.img && urls.push(i.img));
            }
          });
        }
      });
    }

    // Filtrar falsy values y duplicados
    return [...new Set(urls.filter(Boolean))];
  }, [player.avatarImg, player.classImg, weapons, creatures, armors, pets, items]);

  const { imagesPreloaded, progress } = useImagePreloader(imageUrlsToPreload);

  return (
    <BrowserRouter>
      {/* Loaders (Sin UI, solo data logic) */}
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

      {/* Pantalla de Carga Global */}
      {!imagesPreloaded && <GlobalLoadingScreen progress={progress} />}

      {/* Renderizado de la app real, montada siempre pero visible u oculta, 
          o solo renderizada cuando terminó de cargar (aquí optamos por montar 
          solo si cargó para evitar parpadeos). */}
      {imagesPreloaded && (
        <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
          <Particles />
          <HeaderMenu />
          <DelayedDisplay delay={300} duration={200}>
            <Routes>
              <Route path="*" element={<Navigate to="/" replace />} />
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
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
