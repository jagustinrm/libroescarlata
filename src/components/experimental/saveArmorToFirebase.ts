import { database } from '../../firebase/firebaseConfig'; // Importa la configuración de Firebase
import { ref, set, get } from 'firebase/database'; // Importa las funciones necesarias de Firebase
import { Armor } from '../../stores/types/armor';

// Función para guardar una armadura en Firebase con control de ID único
export const saveArmorToFirebase = async (armorId: string, armor: Armor) => {
  try {
    // Define la referencia en Firebase donde se verificará la existencia del ID
    const armorRef = ref(database, `armors/${armorId}`);

    // Verifica si el ID ya existe
    const snapshot = await get(armorRef);
    if (snapshot.exists()) {
      console.warn(
        `El ID ${armorId} ya existe en Firebase. Genera un nuevo ID.`,
      );
      return; // Evita guardar la armadura si el ID ya existe
    }

    // Guarda el objeto 'armor' en la ruta de Firebase correspondiente
    await set(armorRef, armor);
    console.log('Armadura guardada correctamente en Firebase.');
  } catch (error) {
    console.error('Error al guardar la armadura en Firebase:', error);
  }
};
