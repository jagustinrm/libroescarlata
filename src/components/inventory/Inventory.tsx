import { useEffect, useState } from 'react';
import './Inventory.css';
import type { Inventory } from '../../stores/types/inventory';
import BackButton from '../UI/BackButton';
import FloatingMessage from '../UI/floatingMessage/FloatingMessage';
import PlayerEquipment from './Equipment';
import AccesoriesEquipment from './AccesoriesEquip';
import WeaponEquipment from './WeaponsEquip';
import ReadBook from '../book/Book';
import { handleLoadActualInventory } from './loadInventory';
import useGlobalState from '../../customHooks/useGlobalState';
import { Item } from '../../stores/types/items';
import InventoryList from './InventoryList';
import { ItemDetails } from './ItemsDetails';
import { inventoryCategories } from '../../utils/inventoryCategories';
import { handleSelectItem } from './handleSelectItem';
import useFilteredInventoryEffect from './useFilteredInventoryEffect ';
export default function Inventory() {
  const [actualInventory, setActualInventory] = useState<Array<[Item, number]> | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [readBook, setReadBook] = useState<boolean>(false);
  const {setFloatingMessage, floatingMessage, player, inventories} = useGlobalState();
  const [selectedAccessoryEquipped, setSelectedAccessoryEquipped] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [actualCategory, setActualCategory] = useState<keyof Inventory>('weapons');

  const handleRead = () => {
    setReadBook(!readBook);
  };
  const inventory = inventories[player.inventoryId]
 
    useFilteredInventoryEffect({ 
      actualCategory, 
      inventory, 
      setActualInventory, 
      handleSelectItem, 
      setSelectedItem 
    });

  const lineImg = () =>  {
    return ( 
      <>
        <img className="lines" src="/img/UI/horizontallines.png" alt="" />
        <img className="lines" src="/img/UI/horizontallines.png" alt="" />
      </>
    )}

  return (
    <section style={{ display: 'flex', flexDirection: 'row' }}>
      {readBook && (
        <ReadBook selectedItem={selectedItem} handleRead={handleRead} />
      )}
      <div className="sectionInventory rpgui-container framed-golden-2">
        <div className='sectionTitle'>
          {lineImg()}
          <h1 className="inventoryTitle">INVENTARIO</h1>
          {lineImg()}
        </div>
        <div className="buttonsInventory  rpgui-cursor-point">
          {inventoryCategories.map(({ key, icon }) => (
          <img
            key={key}
            onClick={() => handleLoadActualInventory(key as keyof Inventory, setActualInventory, setActualCategory)}
            className="inventoryIcons"
            src={`/img/icons/itemsIcons/${icon}`}
            alt={`${key} icon`}
          />
        ))}
        </div>
        <div className="inventoryLayout">
        <InventoryList actualInventory={actualInventory} setSelectedItem={setSelectedItem} />
        <ItemDetails 
        selectedItem={selectedItem} 
        selectedAccessoryEquipped={selectedAccessoryEquipped}
        handleRead= {handleRead}
        setFloatingMessage= {setFloatingMessage} 
        actualCategory= {actualCategory}
        />
         </div>
        <div className='sectionTitle'>
        {lineImg()}
        <BackButton />
        {floatingMessage && (
          <FloatingMessage
            message={floatingMessage.message}
            onComplete={() => setFloatingMessage(null)}
          />
        )}
         {lineImg()}
        </div>
      </div>
      {actualCategory === 'armors' && <PlayerEquipment />}
      {actualCategory === 'accessories' && (
        <AccesoriesEquipment
          selectedAccessoryEquipped={selectedAccessoryEquipped}
          setSelectedAccessoryEquipped={setSelectedAccessoryEquipped}
        />
      )}
      {actualCategory === 'weapons' && <WeaponEquipment />}
    </section>
  );
}
