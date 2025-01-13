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
import PlayerEquipment from './Equipment';
import AccesoriesEquipment from './AccesoriesEquip';
import WeaponEquipment from './WeaponsEquip';

export default function Inventory() {
  const [actualInventory, setActualInventory] = useState<Array<
    Weapon | Armor | Potion | Accessory | otherItem
  > | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedAccessoryEquipped, setSelectedAccessoryEquipped] = useState<{ type: string; index: number } | null>(null);

  const {
    player,
    playerActions,
    inventories,
    weapons,
    potions,
    armors,
    otherItems,
    accessories,
  } = useGlobalState();
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);
  const [actualCategory, setActualCategory] = useState('');

  const handleLoadActualInventory = (category: keyof Inventory) => {
    if (!player.inventoryId || !inventories[player.inventoryId]) {
      setActualInventory(null);
      return;
    }

    const itemNames = inventories[player.inventoryId][category];
    if (!itemNames) {
      setActualInventory([]);
      return;
    }

    let selectedCategory: Array<Weapon | Armor | Potion | Accessory | otherItem> = [];
    setActualCategory(category);

    switch (category) {
      case 'armors':
        selectedCategory = armors.filter((armor: Armor) =>
          itemNames.includes(armor.id),
        );
        break;
      case 'weapons':
        selectedCategory = weapons.filter((weapon: Weapon) =>
          itemNames.includes(weapon.id),
        );
        break;
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
      case 'accessories':
        selectedCategory = accessories.filter((accessory: Accessory) =>
          itemNames.includes(accessory.id),
        );
        break;
      default:
        selectedCategory = [];
        break;
    }

    setActualInventory(selectedCategory);
  };

  const handleSelectItem = (itemId: string | number) => {
    const id = isNaN(Number(itemId)) ? itemId : Number(itemId);
    const weapon = weapons.find((weapon: Weapon) => weapon.id === id);
    const potion = potions.find((potion: Potion) => potion.id === id);
    const otherItem = otherItems.find((otherItem: otherItem) => otherItem.id === id);
    const armor = armors.find((armor: Armor) => armor.id === id);
    const accessory = accessories.find((accessory: Accessory) => accessory.id === id);

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

  const handleEquip = (selectedItem: Weapon | Armor | Potion | Accessory | null) => {
    if (!selectedItem) {
      console.error('No hay un objeto seleccionado para equipar.');
      return;
    }

    if ('bodyPart' in selectedItem && 'armorValue' in selectedItem) {
      playerActions.setP_SelectedBodyPart(selectedItem as Armor);
      setFloatingMessage('¡Equipado!');
    } else if ('damage' in selectedItem && 'bodyPart' in selectedItem) {
      playerActions.setP_SelectedBodyPart(selectedItem as Weapon);
      setFloatingMessage('¡Equipado!');
    } else if (
      'type' in selectedItem &&
      (selectedItem.type === 'Amuleto' || selectedItem.type === 'Anillo' || selectedItem.type === 'Aro')
    ) {
      if (selectedAccessoryEquipped) {
        console.log(selectedAccessoryEquipped)
        playerActions.addP_SelectedAccesories(selectedItem as Accessory, selectedAccessoryEquipped.index);
        setFloatingMessage('¡Accesorio equipado!');
      } else {
        playerActions.addP_SelectedAccesories(selectedItem as Accessory);
        // setFloatingMessage('Selecciona un accesorio primero.');
      }
    } else {
      console.log('Este objeto no puede ser equipado.');
    }
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'row' }}>
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
                  <li key={index} onClick={() => handleSelectItem(item.id)}>
                    {item.name}
                  </li>
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
