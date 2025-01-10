import { useState } from 'react';
import './Inventory.css';
import type { Inventory } from '../../stores/types/inventory';
import BackButton from '../UI/BackButton';
import { Armor } from '../../stores/types/armor';
import { Potion } from '../../stores/types/potions';
import { Weapon } from '../../stores/types/weapons';
import ButtonEdited from '../UI/ButtonEdited';
import FloatingMessage from '../UI/floatingMessage/FloatingMessage';
import useGlobalState from '../../customHooks/useGlobalState';
import { otherItem } from '../../stores/types/otherItems';
import { Accessory } from '../../stores/types/accesories';


export default function Inventory() {
  const [actualInventory, setActualInventory] = useState<Array<
    Weapon | Armor | Potion | Accessory | otherItem
  > | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const {player, playerActions, inventories, weapons, potions, armors, otherItems, accessories} = useGlobalState();
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);

const handleLoadActualInventory = (category: keyof Inventory) => {
    if (!player.inventoryId || !inventories[player.inventoryId]) {
      setActualInventory(null);
      return;
    }

    const itemNames = inventories[player.inventoryId][category]; // Nombres de los objetos
    if (!itemNames || itemNames.length === 0) {
      setActualInventory([]);
      return;
    }

    let selectedCategory: Array<Weapon | Armor | Potion | otherItem> = [];

    // Filtrar según la categoría
    switch (category) {
      case 'armors': {
        selectedCategory = armors.filter((armor: Armor) =>
          itemNames.includes(armor.id),
        );
        break;
      }
      case 'weapons': {
          selectedCategory = weapons.filter((weapon: Weapon) =>
            itemNames.includes(weapon.id),
          );
        break;
      }
      case 'potions':
        selectedCategory = potions.filter((potion: Potion) =>
          itemNames.includes(potion.id),
        );
        break;
      case 'others':
        selectedCategory = otherItems.filter((otherItem: otherItem) =>
          itemNames.includes(otherItem.id),
        );
        break;
      case 'accessories': {
        selectedCategory = accessories.filter((accessory: Accessory) =>
          itemNames.includes(accessory.id),
        );
          break
        }

      default:
        selectedCategory = [];
        break;
    }
    
    setActualInventory(selectedCategory);
  };

  const handleSelectItem = (itemName: string) => {
    // MODIFICAR, NECESITO QUE TODO UTILICE ID
    const itemId = isNaN(Number(itemName)) ? itemName : Number(itemName);
    const weapon = weapons.find((weapon: Weapon) => weapon.id === itemId);
    const potion = potions.find((potion: Potion) => potion.id === itemId);
    const otherItem = otherItems.find((otherItem: otherItem) => otherItem.id == itemId);
    const armor = armors.find((armor: Armor) => armor.id === itemId);
    const accessory = accessories.find((accesory: Accessory) => accesory.id === itemId);
    if (weapon) {
      setSelectedItem(weapon);
      return;
    }
    if (accessory) {
      setSelectedItem(accessory);
      return;
    }
    if (potion) {
      setSelectedItem(potion);
      return;
    }
    if (otherItem) {
      setSelectedItem(otherItem);
      return;
    }
    if (armor) {
      setSelectedItem(armor);
      return;
    }
    
    setSelectedItem(null);
  };

  const handleEquip = (selectedItem: Weapon | Armor | Potion | null) => {
    if (!selectedItem) {
      console.error('No hay un objeto seleccionado para equipar.');
      return;
    }

    // Equipar según el tipo del objeto
    if ('bodyPart' in selectedItem && 'armorValue' in selectedItem  ) {
      playerActions.setP_SelectedBodyPart(selectedItem as Armor);
      setFloatingMessage('¡Equipado!');
    } else if ('damage' in selectedItem && 'bodyPart' in selectedItem ) {
      playerActions.setP_SelectedBodyPart(selectedItem as Weapon);
      setFloatingMessage('¡Equipado!');
    } else {
      console.log('Este objeto no puede ser equipado.');
    }
  };

  return (
    <section style={{display: "flex", flexDirection: "row"}}>
      <div className="sectionInventory rpgui-container framed-golden-2">
      <h1>Inventario</h1>
      <div className="buttonsInventory">
        <button
          className="rpgui-button editedButtond"
          onClick={() => handleLoadActualInventory('weapons')}
        >
          Armas
        </button>
        <button
          className="rpgui-button editedButtond"
          onClick={() => handleLoadActualInventory('armors')}
        >
          Armaduras
        </button>
        <button
          className="rpgui-button editedButtond"
          onClick={() => handleLoadActualInventory('potions')}
        >
          Pociones
        </button>
        <button
          className="rpgui-button editedButtond"
          onClick={() => handleLoadActualInventory('books')}
        >
          Libros
        </button>
        <button
          className="rpgui-button editedButtond "
          onClick={() => handleLoadActualInventory('scrolls')}
        >
          Pergaminos
        </button>
        <button
          className="rpgui-button editedButtond "
          onClick={() => handleLoadActualInventory('accessories')}
        >
          Accesorios
        </button>
        <button
          className="rpgui-button editedButtond"
          onClick={() => handleLoadActualInventory('others')}
        >
          Otros
        </button>
      </div>
      <div className="inventoryLayout">
        <div className="containerInventory">
          <ul className="rpgui-list-imp">
            {actualInventory && actualInventory.length > 0 ? (
              actualInventory.map((item, index) => (
                <>
                  <li key={index} onClick={() => handleSelectItem(item.id)}>
                    {item.name}{' '}
                    {/* Aquí item es un objeto, no una propiedad del objeto */}
                  </li>
                </>
              ))
            ) : (
              <p>No se encontraron</p>
            )}
          </ul>
        </div>
        <div className="detailsContainer">
          {selectedItem ? (
            <>
              <h2>{selectedItem.name}</h2>
              <img
                className="itemIventoryImg"
                src={selectedItem.img}
                alt={selectedItem.name}
              />
              <p>
                <strong>Descripción:</strong> {selectedItem.description}
              </p>
              <p>
                <strong>Armadura:</strong> {selectedItem.armorValue}
              </p>
              {/* <p><strong>Costo:</strong> {selectedItem.cost} <strong>materiales</strong></p> */}
              {selectedItem.damage && (
                <p>
                  <strong>Daño:</strong> {selectedItem.damage} - {selectedItem.damageMax}
                </p>
              )}
            </>
          ) : (
            <p>Selecciona un objeto para ver los detalles</p>
          )}
          {selectedItem && (
            <div style={{ marginTop: '3px' }}>
              <ButtonEdited
                label="Equipar"
                width="130px"
                height="40px"
                onClick={() => handleEquip(selectedItem)}
              />
            </div>
          )}
        </div>
      </div>
      <BackButton />
      {floatingMessage && (
        <FloatingMessage
          message={floatingMessage}
          onComplete={() => setFloatingMessage(null)}
        />
      )}
      </div>
      <div className='rpgui-container framed-golden-2 containerEquipment'>
      <img 
        className='head' 
        src={player.bodyParts?.cabeza?.img || "https://via.placeholder.com/150"} 
        alt="Head Item" 
      />
      <img 
        className='chest' 
        src={player.bodyParts?.pecho?.img || "https://via.placeholder.com/150"} 
        alt="Chest Item" 
      />
      <img 
        className='belt' 
        src={player.bodyParts?.cintura?.img || "https://via.placeholder.com/150"} 
        alt="Belt Item" 
      />

      <img 
        className='back' 
        src={player.bodyParts?.espalda?.img || "https://via.placeholder.com/150"} 
        alt="Back Item" 
      />
      <img 
        className='boots' 
        src={player.bodyParts?.pies?.img || "https://via.placeholder.com/150"} 
        alt="Boots Item" 
      />
      <img 
        className='gloves' 
        src={player.bodyParts?.manos?.img || "https://via.placeholder.com/150"} 
        alt="Gloves Item" 
      />
            <img 
        className='legs' 
        src={player.bodyParts?.piernas?.img || "https://via.placeholder.com/150"} 
        alt="Legs Item" 
      />
        <img 
        className='face' 
        src={player.bodyParts?.cara?.img || "https://via.placeholder.com/150"} 
        alt="Face Item" 
      />
        <img 
        className='shoulder' 
        src={player.bodyParts?.hombros?.img || "https://via.placeholder.com/150"} 
        alt="Shoulder Item" 
      />
      </div>
    </section>
  );
}
