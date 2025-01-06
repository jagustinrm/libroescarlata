// import { database } from './firebaseConfig'; // Importa la configuración de Firebase
// import { ref, set, get, remove, update } from 'firebase/database'; // Importa las funciones necesarias de Firebase
// import { Armor } from '../stores/types/armor';
// // import useGlobalState from '../customHooks/useGlobalState';
// import useArmorStore from '../stores/armorStore';

// // Función para guardar una armadura en Firebase con control de ID único
// export const saveArmorToFirebase = async (armorId: string, armor: Armor) => {
//   const {armors} = useArmorStore.getState();
//   try {
//     const armorExistsInGlobalState = armors.some((existingArmor) => existingArmor.id === armorId);
//     if (armorExistsInGlobalState) {
//       console.warn(`El ID ${armorId} ya existe en el estado global. No se guardará.`);
//       return; 
//     }
//     // Define la referencia en Firebase donde se verificará la existencia del ID
//     const armorRef = ref(database, `armors/${armorId}`);

//     // Verifica si el ID ya existe
//     const snapshot = await get(armorRef);
//     if (snapshot.exists()) {
//       console.warn(
//         `El ID ${armorId} ya existe en Firebase. Genera un nuevo ID.`,
//       );
//       return; // Evita guardar la armadura si el ID ya existe
//     }

//     // Guarda el objeto 'armor' en la ruta de Firebase correspondiente
//     await set(armorRef, armor);
//     console.log('Armadura guardada correctamente en Firebase.');
//   } catch (error) {
//     console.error('Error al guardar la armadura en Firebase:', error);
//   }
// };

// export const deleteArmorFromFirebase = async (armorId: string) => {
//   try {
//     const armorRef = ref(database, `armors/${armorId}`);
//     const snapshot = await get(armorRef);
//     if (!snapshot.exists()) {
//       console.warn(`La armadura con ID ${armorId} no existe en Firebase.`);
//       return;
//     }
//     console.log(`Consultando referencia: armors/${armorId}`);
//     const armorData = snapshot.val();
//     console.log(armorData);
//     if (!armorData.deletable) {
//       console.warn(
//         `La armadura con ID ${armorId} no se puede eliminar porque 'deletable' está en false.`,
//       );
//       return;
//     }
//     await remove(armorRef);
//     console.log(
//       `Armadura con ID ${armorId} eliminada correctamente de Firebase.`,
//     );
//   } catch (error) {
//     console.error(
//       `Error al eliminar la armadura con ID ${armorId} de Firebase:`,
//       error,
//     );
//   }
// };

// export const getArmorsFromFirebase = async (): Promise<Armor[]> => {
//   try {
//     const armorsRef = ref(database, 'armors');
//     const snapshot = await get(armorsRef);
//     if (snapshot.exists()) {
//       const armorsData = snapshot.val();
//       const armors: Armor[] = Object.keys(armorsData).map((key) => ({
//         id: key,
//         ...armorsData[key],
//       }));
//       return armors; // Devuelve el array de armaduras
//     } else {
//       console.log('No se encontraron armaduras en Firebase.');
//       return [];
//     }
//   } catch (error) {
//     console.error('Error al obtener las armaduras de Firebase:', error);
//     return [];
//   }
// };

// // Actualiza la propiedad 'deletable' de la armadura
// export const updateArmorDeletable = async (
//   armorId: string,
//   deletable: boolean,
// ) => {
//   try {
//     const armorRef = ref(database, `armors/${armorId}`);
//     const snapshot = await get(armorRef);
//     if (!snapshot.exists()) {
//       console.warn(`La armadura con ID ${armorId} no existe en Firebase.`);
//       return;
//     }
//     await update(armorRef, { deletable });
//     console.log(
//       `Propiedad 'deletable' de la armadura con ID ${armorId} actualizada a ${deletable}.`,
//     );
//   } catch (error) {
//     console.error(
//       `Error al actualizar la propiedad 'deletable' de la armadura con ID ${armorId}:`,
//       error,
//     );
//   }
// };
