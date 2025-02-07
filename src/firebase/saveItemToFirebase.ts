import { database } from './firebaseConfig';
import { ref, set, get, remove } from 'firebase/database';
import { Item } from '../stores/types/items';
import { Weapon } from '../stores/types/weapons';
import { Accessory } from '../stores/types/accesories';
import { Armor } from '../stores/types/armor';
import { generateUniqueId } from '../generators/generateUniqueId';
import { Scroll } from '../stores/types/scrolls';

// Función para guardar un ítem en Firebase
export const saveItemToFirebase = async (
  playerId: string, // Se agrega el ID del jugador como parámetro
  itemId: string,
  item: Item,
  itemType: string,
) => {
  try {
    // Define la referencia en Firebase según el tipo del ítem, ID del jugador y del ítem
    const itemRef = ref(database, `${itemType}_${playerId}/${itemId}`);

    // Verifica si el ID ya existe en Firebase
    const snapshot = await get(itemRef);
    if (snapshot.exists()) {
      console.warn(
        `El ID ${itemId} ya existe en Firebase en la categoría ${itemType} para el jugador ${playerId}. Genera un nuevo ID.`,
      );
      const uniqueId = await generateUniqueId(itemType);
      const newItem = { ...item, id: uniqueId };
      const newItemRef = ref(database, `${itemType}_${playerId}/${uniqueId}`);
      await set(newItemRef, newItem);

      console.log(
        `Ítem con nuevo ID "${uniqueId}" guardado correctamente bajo la categoría "${itemType}" para el jugador "${playerId}".`,
      );
      return;
    }

    // Guarda el ítem en la ruta correspondiente
    await set(itemRef, item);
    console.log(
      `Ítem de tipo ${itemType} con ID ${itemId} guardado correctamente en Firebase para el jugador ${playerId}.`,
    );
  } catch (error) {
    console.error(
      `Error al guardar el ítem de tipo ${itemType} con ID ${itemId} en Firebase para el jugador ${playerId}:`,
      error,
    );
  }
};

// Función para obtener ítems desde Firebase
export const getItemsFromFirebase = async (
  playerId: string, // Se agrega el ID del jugador como parámetro
): Promise<{
  weapons: Weapon[];
  accessories: Accessory[];
  armors: Armor[];
  scrolls: Scroll[];
}> => {
  try {
    // Define las referencias de armas, accesorios y armaduras para el jugador
    const weaponsRef = ref(database, `weapons_${playerId}`);
    const accessoriesRef = ref(database, `accessories_${playerId}`);
    const armorsRef = ref(database, `armors_${playerId}`); // Referencia para armors
    const scrollsRef = ref(database, `scrolls_${playerId}`); // Referencia para armors

    // Obtén los datos desde Firebase en paralelo
    const [
      snapshotWeapons,
      snapshotAccessories,
      snapshotArmors,
      snapshotScrolls,
    ] = await Promise.all([
      get(weaponsRef),
      get(accessoriesRef),
      get(armorsRef),
      get(scrollsRef),
    ]);

    // Mapea los datos a arrays de Weapon, Accessory y Armor
    const weapons: Weapon[] = snapshotWeapons.exists()
      ? Object.keys(snapshotWeapons.val()).map((key) => ({
          id: key,
          ...snapshotWeapons.val()[key],
        }))
      : [];

    const accessories: Accessory[] = snapshotAccessories.exists()
      ? Object.keys(snapshotAccessories.val()).map((key) => ({
          id: key,
          ...snapshotAccessories.val()[key],
        }))
      : [];

    const armors: Armor[] = snapshotArmors.exists()
      ? Object.keys(snapshotArmors.val()).map((key) => ({
          id: key,
          ...snapshotArmors.val()[key],
        }))
      : [];
    const scrolls: Scroll[] = snapshotScrolls.exists()
      ? Object.keys(snapshotScrolls.val()).map((key) => ({
          id: key,
          ...snapshotScrolls.val()[key],
        }))
      : [];
    return { weapons, accessories, armors, scrolls }; // Retorna todos los arrays en un objeto
  } catch (error) {
    console.error(
      `Error al obtener los ítems desde Firebase para el jugador ${playerId}:`,
      error,
    );
    return { weapons: [], accessories: [], armors: [], scrolls: [] };
  }
};

export const removeItemFromFirebase = async (
  playerId: string,
  itemId: string,
  itemType: string,
): Promise<void> => {
  try {
    // Define la referencia en Firebase según el tipo del ítem, ID del jugador y del ítem
    const itemRef = ref(database, `${itemType}_${playerId}/${itemId}`);

    // Elimina el ítem de Firebase
    await remove(itemRef);

    console.log(
      `Ítem de tipo ${itemType} con ID ${itemId} eliminado correctamente de Firebase para el jugador ${playerId}.`,
    );
  } catch (error) {
    console.error(
      `Error al eliminar el ítem de tipo ${itemType} con ID ${itemId} desde Firebase para el jugador ${playerId}:`,
      error,
    );
  }
};
