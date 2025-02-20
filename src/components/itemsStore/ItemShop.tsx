import React, { useState } from 'react';
import './ItemShop.css';
import {Items } from '../../stores/types/items';
import BackButton from '../UI/BackButton';
import FloatingMessage from '../UI/floatingMessage/FloatingMessage';
import ItemGrid from './itemCards';
import { inventoryCategories } from '../../utils/inventoryCategories';
import { Inventory } from '../../stores/types/inventory';
import useGlobalState from '../../customHooks/useGlobalState';
import { HoverInfo } from '../UI/hoverInfo/HoverInfoComponent';
import ShopMenu from './ShopMenu';
const ItemShop: React.FC = () => {
  const {player, items, hoverInfo, setHoverInfo} = useGlobalState();
  const [selectedType, setSelectedType] = useState<keyof Items>('weapons');
  const shopId = 1;
  const {setFloatingMessage, floatingMessage} = useGlobalState();
  const [buyOrSell, setBuyOrSell] = useState('Comprar');

  const handleMouseMove = (
    event: React.MouseEvent,
    description: string,
    armorValue?: number,
    damage?: number,
    damageMax?: number,
    levelRequirement?: number,
  ) => {
    setHoverInfo({
      description,
      armorValue,
      damage,
      damageMax,
      levelRequirement,
      x: event.pageX, 
      y: event.pageY, 
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
  };
  const lineImg = () =>  {
    return ( 
      <>
        <img className="lines" src="/img/UI/horizontallines.png" alt="" />
        <img className="lines" src="/img/UI/horizontallines.png" alt="" />
      </>
    )}
  return (
    <div>
      <ShopMenu 
      buyOrSell= {buyOrSell} 
      setBuyOrSell = {setBuyOrSell}
      />
      <div className="item-shop-container rpgui-container framed-golden-2">
      <div
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        {lineImg()}
        <h1>MERCADO</h1>
        {lineImg()}
      </div>
      {/* Botones dinámicos para seleccionar tipo de ítems */}
      <div className="catalog-buttons  rpgui-cursor-point">
      {inventoryCategories.map(({ key, icon }) => (
          <img 
          key= {key} 
          onClick={() => setSelectedType(key as keyof Inventory)}
          src={`/img/icons/itemsIcons/${icon}`} 
          alt={`${key} icon`} 
          className="inventoryIcons"
          />
        ))}
      </div>

      {/* Renderizado de ítems basado en el tipo seleccionado */}
      <ItemGrid
        selectedType={selectedType}
        items={items}
        shopId={shopId}
        handleMouseMove={handleMouseMove}
        handleMouseLeave={handleMouseLeave}
        setFloatingMessage={setFloatingMessage}
        buyOrSell= {buyOrSell} 
      />
      <BackButton />
      <p>Materiales: {player.playerMaterial} 🛠️</p>

      {/* Tooltip de información */}
      {hoverInfo && (
         <HoverInfo/>
      )}
      {/* Mensaje de compra */}
      {floatingMessage && (
        <FloatingMessage
          message={floatingMessage.message}
          onComplete={() => setFloatingMessage(null)}
        />
      )}
    </div>
    </div>
   
  );
};

export default ItemShop;
