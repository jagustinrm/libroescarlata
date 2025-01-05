import { database } from './firebaseConfig';
import { ref, set, get } from 'firebase/database'; // Si necesitas otras funciones como `remove` o `update`, agrégalas aquí.
import { Item } from '../stores/types/items'; // Asegúrate de importar el tipo `Item`

export const saveItemToFirebase = async (
  itemId: string,
  item: Item,
  itemType: string,
) => {
  try {
    // Define la referencia en Firebase según el tipo del ítem y su ID
    const itemRef = ref(database, `${itemType}/${itemId}`);

    // Verifica si el ID ya existe en Firebase
    const snapshot = await get(itemRef);
    if (snapshot.exists()) {
      console.warn(
        `El ID ${itemId} ya existe en Firebase en la categoría ${itemType}. Genera un nuevo ID.`,
      );
      return; // Evita guardar el ítem si el ID ya existe
    }
    // Guarda el ítem en la ruta correspondiente
    await set(itemRef, item);
    console.log(
      `Ítem de tipo ${itemType} con ID ${itemId} guardado correctamente en Firebase.`,
    );
  } catch (error) {
    console.error(
      `Error al guardar el ítem de tipo ${itemType} con ID ${itemId} en Firebase:`,
      error,
    );
  }
};

export const getItemsFromFirebase = async (): Promise<{ weapons: Item[]; accessories: Item[] }> => {
  try {
    const weaponsRef = ref(database, 'weapons');
    const accessoriesRef = ref(database, 'accessories');

    const [snapshotWeapons, snapshotAccessories] = await Promise.all([
      get(weaponsRef),
      get(accessoriesRef),
    ]);

    const weapons: Item[] = snapshotWeapons.exists()
      ? Object.keys(snapshotWeapons.val()).map((key) => ({
          id: key,
          ...snapshotWeapons.val()[key],
        }))
      : [];

    const accessories: Item[] = snapshotAccessories.exists()
      ? Object.keys(snapshotAccessories.val()).map((key) => ({
          id: key,
          ...snapshotAccessories.val()[key],
        }))
      : [];

    return { weapons, accessories }; // Retorna ambos arrays en un objeto
  } catch (error) {
    console.error('Error al obtener los ítems de Firebase:', error);
    return { weapons: [], accessories: [] };
  }
};
