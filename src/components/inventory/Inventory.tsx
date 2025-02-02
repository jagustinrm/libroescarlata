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
import { darkenHex } from '../../utils/darkenHex';
import { Book } from '../../stores/types/books';
import ReadBook from '../book/Book';
import { Scroll } from '../../stores/types/scrolls';

export default function Inventory() {
  const [actualInventory, setActualInventory] = useState<Array<
    Weapon | Armor | Potion | Accessory | otherItem | Book | Scroll
  > | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [readBook, setReadBook] = useState<boolean>(false);
  const [selectedAccessoryEquipped, setSelectedAccessoryEquipped] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const {
    player,
    playerActions,
    inventories,
    weapons,
    potions,
    armors,
    otherItems,
    accessories,
    books,
    scrolls,
  } = useGlobalState();

  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);
  const [actualCategory, setActualCategory] = useState('');
  const handleLoadActualInventory = (category: keyof Inventory) => {
    if (!player.inventoryId || !inventories[player.inventoryId]) {
      setActualInventory(null);
      return;
    }

    const itemNames = inventories[player.inventoryId][category];
    console.log(inventories[player.inventoryId])
    if (!itemNames) {
      setActualInventory([]);
      return;
    }

    let selectedCategory: Array<
      Weapon | Armor | Potion | Accessory | otherItem | Scroll
    > = [];
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
      case 'books':
        selectedCategory = books.filter((book: Book) =>
          itemNames.includes(book.id),
        );
        break;
      case 'scrolls':
        console.log(scrolls);
        selectedCategory = scrolls.filter((scroll: Scroll) =>
          itemNames.includes(scroll.id),
        );
        console.log(selectedCategory)
        break;
      default:
        selectedCategory = [];
        break;
    }

    setActualInventory(selectedCategory);
  };

  const handleSelectItem = (itemId: string | number) => {

    const weapon = weapons.find((weapon: Weapon) => weapon.id === itemId);
    const potion = potions.find((potion: Potion) => potion.id === itemId);
    const otherItem = otherItems.find(
      (otherItem: otherItem) => otherItem.id === itemId,
    );

    const armor = armors.find((armor: Armor) => armor.id === itemId);
    const accessory = accessories.find(
      (accessory: Accessory) => accessory.id === itemId,
    );
    const book = books.find((book: Book) => book.id === itemId);
    const scroll = scrolls.find((scroll: Scroll) => scroll.id === itemId);
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
      console.log(otherItem)
      setSelectedItem(otherItem);
      return;
    }
    if (armor) {
      setSelectedItem(armor);
      return;
    }
    if (book) {
      setSelectedItem(book);
      return;
    }
    if (scroll) {
      setSelectedItem(scroll);
      return;
    }
    setSelectedItem(null);
  };

  const handleEquip = (
    selectedItem: Weapon | Armor | Potion | Accessory | Book | Scroll | null,
  ) => {
    if (!selectedItem) {
      console.error('No hay un objeto seleccionado para equipar.');
      return;
    }

    if ('bodyPart' in selectedItem && 'armorValue' in selectedItem) {
      console.log(selectedItem)
      playerActions.setP_SelectedBodyPart(selectedItem as Armor);
      setFloatingMessage('¡Equipado!');
    } else if ('damage' in selectedItem && 'bodyPart' in selectedItem) {
      playerActions.setP_SelectedBodyPart(selectedItem as Weapon);
      setFloatingMessage('¡Equipado!');
    } else if (
      'type' in selectedItem &&
      (selectedItem.type === 'Amuleto' ||
        selectedItem.type === 'Anillo' ||
        selectedItem.type === 'Aro')
    ) {
      if (selectedAccessoryEquipped) {
        playerActions.addP_SelectedAccesories(
          selectedItem as Accessory,
          selectedAccessoryEquipped.index,
        );
        setFloatingMessage('¡Accesorio equipado!');
      } else {
        // playerActions.addP_SelectedAccesories(selectedItem as Accessory);
        setFloatingMessage('Selecciona un accesorio primero.');
      }
    } else {
      console.log('Este objeto no puede ser equipado.');
    }
  };

  const handleRead = () => {
    setReadBook(!readBook);
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'row' }}>
      {readBook && (
        <ReadBook selectedItem={selectedItem} handleRead={handleRead} />
      )}
      <div className="sectionInventory rpgui-container framed-golden-2">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <img className="lines" src="/img/UI/horizontallines.png" alt="" />
          <img className="lines" src="/img/UI/horizontallines.png" alt="" />
          <h1 className="inventoryTitle">INVENTARIO</h1>
          <img className="lines" src="/img/UI/horizontallines.png" alt="" />
          <img className="lines" src="/img/UI/horizontallines.png" alt="" />
        </div>
        <div className="buttonsInventory  rpgui-cursor-point">
          <img
            onClick={() => handleLoadActualInventory('weapons')}
            className="inventoryIcons"
            src="/img/icons/itemsIcons/weaponsicon.png"
            alt=""
          />
          <img
            onClick={() => handleLoadActualInventory('armors')}
            className="inventoryIcons"
            src="/img/icons/itemsIcons/armoricon.png"
            alt=""
          />
          <img
            onClick={() => handleLoadActualInventory('accessories')}
            className="inventoryIcons"
            src="/img/icons/itemsIcons/accessoriesicon.png"
            alt=""
          />
          <img
            onClick={() => handleLoadActualInventory('others')}
            className="inventoryIcons"
            src="/img/icons/itemsIcons/foodicon.png"
            alt=""
          />
          <img
            onClick={() => handleLoadActualInventory('potions')}
            className="inventoryIcons"
            src="/img/icons/itemsIcons/potionicon.png"
            alt=""
          />
          <img
            onClick={() => handleLoadActualInventory('books')}
            className="inventoryIcons"
            src="/img/icons/itemsIcons/bookicon.png"
            alt=""
          />
          <img
            onClick={() => handleLoadActualInventory('scrolls')}
            className="inventoryIcons"
            src="/img/icons/itemsIcons/scrollicon.png"
            alt=""
          />
        </div>
        <div className="inventoryLayout">
          <div className="containerInventory">
            <ul className="rpgui-list-imp">
              {actualInventory && actualInventory.length > 0 ? (
                actualInventory.map(
                  (item, index) =>
                    item.color && (
                      <li
                        key={index}
                        style={{
                          color: darkenHex(item.color, 0, 1),
                          marginTop: '2px',
                        }}
                        onClick={() => handleSelectItem(item.id)}
                      >
                        {item.name}
                      </li>
                    ),
                )
              ) : (
                <p>No se encontraron</p>
              )}
            </ul>
          </div>
          <div
            className="detailsContainer"
            style={
              selectedItem && {
                borderColor: darkenHex(selectedItem.color, 90, 1),
                boxShadow: `0px 0px 1px 3px ${darkenHex(selectedItem.color, 30, 1)}, 0px 0px 0px 4px ${darkenHex(selectedItem.color, 90, 1)}`,
                background: `linear-gradient(0deg, ${darkenHex(selectedItem.color, 70, 0.8)} 10%, ${darkenHex(selectedItem.color, 40)} 50%, ${darkenHex(selectedItem.color, 10)} 70%)`,
              }
            }
          >
            {selectedItem ? (
              <>
                <h2 style={{ color: darkenHex(selectedItem.color, 0, 1) }}>
                  {selectedItem.name}
                </h2>
                <img
                  className="itemIventoryImg"
                  src={selectedItem.img}
                  alt={selectedItem.name}
                />
                {/* <p>
                  <strong>Descripción:</strong> {selectedItem.description}
                </p> */}
                {typeof selectedItem.armorValue === 'number' && (
                  <p>
                    <strong>Armadura:</strong> {selectedItem.armorValue}
                  </p>
                )}
                {typeof selectedItem.damage === 'number' && (
                  <p>
                    <strong>Daño:</strong> {selectedItem.damage} -{' '}
                    {selectedItem.damageMax}
                  </p>
                )}
                {typeof selectedItem.range === 'number' && (
                  <p>
                    <strong>Rango de ataque:</strong> {selectedItem.range}
                  </p>
                )}
              </>
            ) : (
              <p>Selecciona un objeto para ver los detalles</p>
            )}
            {selectedItem && selectedItem.actions && (
              <div style={{ marginTop: '3px' }}>
                <ButtonEdited
                  label={
                    (selectedItem.actions.equippable && `Equipar`) ||
                    (selectedItem.actions.readable && `Leer`)
                  }
                  width="130px"
                  height="40px"
                  onClick={() =>
                    (selectedItem.actions.equippable &&
                      handleEquip(selectedItem)) ||
                    (selectedItem.actions.readable && handleRead())
                  }
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
