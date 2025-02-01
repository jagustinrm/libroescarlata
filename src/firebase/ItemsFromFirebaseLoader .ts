import { useEffect } from "react";
import { database } from "./firebaseConfig";
import { ref, get } from "firebase/database"; 
import useGlobalState from "../customHooks/useGlobalState";
import { Weapon } from "../stores/types/weapons";
import { Accessory } from "../stores/types/accesories";
import { Armor } from "../stores/types/armor";
import { Scroll } from "../stores/types/scrolls";

const ItemsFromFirebaseLoader = () => {
  const { 
    setWeapons, setAccessories, setArmors, setScrolls, 
    player, weapons, accessories, armors, scrolls, areItemsLoaded, setAreItemsLoaded 
  } = useGlobalState();

  useEffect(() => {
    if (!player?.name) return; 
    if (areItemsLoaded) return;
    const loadItems = async () => {
      try {
        // 🔹 Construir rutas dinámicamente con el nombre del jugador
        const playerWeaponsRef = ref(database, `weapons_${player.name}`);
        const playerAccessoriesRef = ref(database, `accessories_${player.name}`);
        const playerArmorsRef = ref(database, `armors_${player.name}`);
        const playerScrollsRef = ref(database, `scrolls_${player.name}`);

        // 🔹 Obtener datos de cada categoría
        const [weaponsSnap, accessoriesSnap, armorsSnap, scrollsSnap] = await Promise.all([
          get(playerWeaponsRef),
          get(playerAccessoriesRef),
          get(playerArmorsRef),
          get(playerScrollsRef),
        ]);
     
        // 🔹 Convertir los datos de Firebase en arrays
        const newWeapons = weaponsSnap.exists() ? Object.values(weaponsSnap.val()) as Weapon[] : [];
        const newAccessories = accessoriesSnap.exists() ? Object.values(accessoriesSnap.val()) as Accessory[] : [];
        const newArmors = armorsSnap.exists() ? Object.values(armorsSnap.val()) as Armor[] : [];
        const newScrolls = scrollsSnap.exists() ? Object.values(scrollsSnap.val()) as Scroll[] : [];

        // 🔹 Filtrar para que no se agreguen duplicados (comparando por `id`)
        const filteredWeapons = newWeapons.filter(newItem => !weapons.some(existingItem => existingItem.id === newItem.id));
        const filteredAccessories = newAccessories.filter(newItem => !accessories.some(existingItem => existingItem.id === newItem.id));
        const filteredArmors = newArmors.filter(newItem => !armors.some(existingItem => existingItem.id === newItem.id));
        const filteredScrolls = newScrolls.filter(newItem => !scrolls.some(existingItem => existingItem.id === newItem.id));

        // 🔹 Actualizar el estado solo con los nuevos elementos
        setWeapons([...weapons, ...filteredWeapons]);
        setAccessories([...accessories, ...filteredAccessories]);
        setArmors([...armors, ...filteredArmors]);
        setScrolls([...scrolls, ...filteredScrolls]);
      } catch (error) {
        console.error("Error loading items from Firebase:", error);
      }
    };

    loadItems();
    setAreItemsLoaded(true)
  }, [player?.name, setWeapons, setAccessories, setArmors, setScrolls, weapons, accessories, armors, scrolls]);

  return null; 
};

export default ItemsFromFirebaseLoader;
