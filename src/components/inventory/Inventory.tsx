import {useState } from 'react';
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
import { HoverInfo } from '../UI/hoverInfo/HoverInfoComponent';
export default function Inventory() {
  const [actualInventory, setActualInventory] = useState<Array<[Item, number]> | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [readBook, setReadBook] = useState<boolean>(false);
  const {setFloatingMessage, floatingMessage, player, inventories, hoverInfo} = useGlobalState();
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
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>  
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div className="buttonsInventory rpgui-cursor-point">
          {inventoryCategories.slice(0, 4).map(({ key, icon }) => (
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
          <div className="buttonsInventory rpgui-cursor-point">
          {inventoryCategories.slice(4, 7).map(({ key, icon }) => (
            <img
              key={key}
              onClick={() => handleLoadActualInventory(key as keyof Inventory, setActualInventory, setActualCategory)}
              className="inventoryIcons"
              src={`/img/icons/itemsIcons/${icon}`}
              alt={`${key} icon`}
            />
          ))}
          </div>
        </div> 
       <div style={{width: '400px', height: '400px', display:'flex'}}>
      {actualCategory === 'armors' && <PlayerEquipment />}
      {actualCategory === 'accessories' && (
        <AccesoriesEquipment
          selectedAccessoryEquipped={selectedAccessoryEquipped}
          setSelectedAccessoryEquipped={setSelectedAccessoryEquipped}
        />
      )}
      {actualCategory === 'weapons' && <WeaponEquipment />}
      </div>   
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

      {hoverInfo && (<HoverInfo/>)}
    </section>
  );
}
