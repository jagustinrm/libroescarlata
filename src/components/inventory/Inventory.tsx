import { useEffect, useState } from 'react';
import './Inventory.css';
import type { Inventory } from '../../stores/types/inventory';
import BackButton from '../UI/BackButton';
import { Armor } from '../../stores/types/armor';
import { Potion } from '../../stores/types/potions';
import { Weapon } from '../../stores/types/weapons';
import { getArmorsFromFirebase } from '../../firebase/saveArmorToFirebase';
import ButtonEdited from '../UI/ButtonEdited';
import FloatingMessage from '../UI/floatingMessage/FloatingMessage';
import useGlobalState from '../../customHooks/useGlobalState';
import { otherItem } from '../../stores/types/otherItems';

export default function Inventory() {
  const [actualInventory, setActualInventory] = useState<Array<
    Weapon | Armor | Potion | otherItem
  > | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const {player, playerActions, inventories, weapons, potions, armors, otherItems} = useGlobalState();
  const [firebaseArmors, setFirebaseArmors] = useState<(Armor)[] | null>(null);
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);

  useEffect(() => {
    // Carga las armaduras el firebase
    const fetchArmors = async () => {
      try {
        const data = await getArmorsFromFirebase();
        setFirebaseArmors(data);
      } catch (error) {
        console.error('Error al obtener armaduras:', error);
      }
    };
    fetchArmors();
  }, []);

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
      case 'weapons': {
        const weaponsJson: Weapon[] = weapons.filter((weapon: Weapon) =>
          itemNames.includes(weapon.id),
        );
        selectedCategory = weaponsJson;
        break;
      }
      case 'armors': {
        // Verifica que firebaseArmors esté cargado antes de proceder
        if (!firebaseArmors) {
          setActualInventory(
            armors.filter((armor: Armor) => itemNames.includes(armor.id)),
          );
          break;
        }

        // Filtrar las armaduras locales
        const localArmors = armors.filter((armor: Armor) =>
          itemNames.includes(armor.id),
        );
        // Filtrar las armaduras de Firebase
        const fbArmors = firebaseArmors.filter((armor: Armor) =>
          itemNames.includes(armor.id),
        );

        // Combinar las armaduras locales y las de Firebase
        selectedCategory = [...localArmors, ...fbArmors];

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
    if (weapon) {
      setSelectedItem(weapon);
      return;
    }

    const potion = potions.find((potion: Potion) => potion.id === itemId);

    if (potion) {
      setSelectedItem(potion);
      return;
    }

    const otherItem = otherItems.find((otherItem: otherItem) => otherItem.id == itemId);

    if (otherItem) {
      setSelectedItem(otherItem);
      return;
    }
    const armor = armors.find((armor: Armor) => armor.id === itemId);
    if (armor) {
      setSelectedItem(armor);
      return;
    }
    if (firebaseArmors) {
      const firebaseArmor = firebaseArmors.find(
        (armor: Armor) => armor.id === itemId,
      );
      if (firebaseArmor) {
        setSelectedItem(firebaseArmor);
        return;
      }
    }

    setSelectedItem(null);
  };

  const handleEquip = (selectedItem: Weapon | Armor | Potion | null) => {
    if (!selectedItem) {
      console.error('No hay un objeto seleccionado para equipar.');
      return;
    }

    // Equipar según el tipo del objeto
    if ('armorValue' in selectedItem) {
      playerActions.setP_SelectedArmor(selectedItem as Armor);
      setFloatingMessage('¡Equipado!');
    } else if ('damage' in selectedItem) {
      playerActions.setP_SelectedWeapon(selectedItem as Weapon);
      setFloatingMessage('¡Equipado!');
    } else {
      console.log('Este objeto no puede ser equipado.');
    }
  };

  return (
    <section className="sectionInventory rpgui-container framed-golden-2">
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
                  <strong>Daño:</strong> {selectedItem.damage}
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
    </section>
  );
}
