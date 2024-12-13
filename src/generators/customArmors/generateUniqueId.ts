import { ref, get } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";// Asegúrate de importar correctamente tu instancia de Firebase

// Verifica si el ID ya existe en la base de datos
const checkIfIdExists = async (id: string): Promise<boolean> => {
  try {
    const armorRef = ref(database, `armors/${id}`);
    const snapshot = await get(armorRef);
    return snapshot.exists();
  } catch (error) {
    console.error("Error al verificar si el ID existe en Firebase:", error);
    return false;
  }
};

// Genera un ID único que no exista en la base de datos
const generateId = async (): Promise<string> => {
  let id = "";
  let idExists = true;
  do {
    // Genera un ID aleatorio
    id = Math.random().toString(36).substring(7);

    // Verifica si el ID existe
    idExists = await checkIfIdExists(id);
  } while (idExists); // Sigue generando un nuevo ID hasta que sea único
  return id;
};

// Ejemplo de uso
export const generateUniqueId = async () => {

  const uniqueId = await generateId();

  return uniqueId
};


