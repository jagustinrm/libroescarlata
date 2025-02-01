import { database } from './firebaseConfig';
import { useEffect } from 'react';
import { ref, set, get} from 'firebase/database';
import usePlayerStore from '../stores/playerStore';
import { Player } from '../stores/types/player';
import useInventoryStore from '../stores/inventoryStore';
import { Inventory } from '../stores/types/inventory';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// Función para comparar propiedades específicas de dos objetos
const comparePlayerState = (player1: any, player2: any) => {
  // Compara solo las propiedades 'name' y 'level'

  if (!player1) return false;
  return (
    player1.name === player2.name &&
    player1.level === player2.level &&
    player1.playerExp === player2.playerExp &&
    player1.playerMaterial === player2.playerMaterial
  );
};

// Función para guardar el estado en Firebase
const filterPlayerState = (player: Player): Partial<Player> => {
  console.log("DATOS FILTRADOS CON EXITO", player)
  const {
    name,
    playerId,
    level,
    playerExp,
    p_ExpToNextLevel,
    p_ExpPrevLevel,
    p_MaxHealth,
    p_LeftHealth,
    p_MaxMana,
    p_LeftMana,
    hitDie,
    manaDie,
    dodgeDie,
    hitRateDie,
    hitRate,
    dodge,
    dungeonLevel,
    classFeatures,
    classes,
    selectedPet,
    petsName,
    selectedSpell,
    bodyParts,
    accessoriesParts,
    inventoryId,
    playerMaterial,
    stats,
    buffs,
    leftPoints,
    spells,
    statusEffects,
    movement,
    turnSpeed,
    blockChance,
    parry,
    critChance,
    critDamage,
    spellHitRate,
    spellPenetration,
    spellCrit,
    spellDmg,
    spiritReg,
    healthReg,
    healingPower,
    classImg,
    avatarImg,
    storyProgress,
    currentStoryId,
    enemiesDeleted,
  } = player;

  return {
    name,
    playerId,
    level,
    playerExp,
    p_ExpToNextLevel,
    p_ExpPrevLevel,
    p_MaxHealth,
    p_LeftHealth,
    p_MaxMana,
    p_LeftMana,
    hitDie,
    manaDie,
    dodgeDie,
    hitRateDie,
    hitRate,
    dodge,
    dungeonLevel,
    classFeatures,
    classes,
    selectedPet,
    petsName,
    selectedSpell,
    bodyParts,
    accessoriesParts,
    inventoryId,
    playerMaterial,
    stats,
    buffs,
    leftPoints,
    spells,
    statusEffects,
    movement,
    turnSpeed,
    blockChance,
    parry,
    critChance,
    critDamage,
    spellHitRate,
    spellPenetration,
    spellCrit,
    spellDmg,
    spiritReg,
    healthReg,
    healingPower,
    classImg,
    avatarImg,
    storyProgress,
    currentStoryId,
    enemiesDeleted,
  };
};

// Función para guardar el estado del jugador en Firebase
const savePlayerStateToFirebase = async (
  playerId: string,
  player: Player,
  inventory: Inventory,
) => {
  
  const playerRef = ref(database, `players/${playerId}`);
  const inventoryRef = ref(
    database,
    `players/${playerId}/${player.inventoryId}`,
  );
  
  // Filtrar las propiedades relevantes antes de guardar
  const filteredPlayer = filterPlayerState(player);

  // Verifica si los datos han cambiado antes de guardar
  const snapshot = await get(playerRef);
  const existingData = snapshot.val();

  if (!comparePlayerState(existingData, filteredPlayer) && playerId !== 'guest-player') {
    await set(playerRef, filteredPlayer);
    await set(inventoryRef, inventory);
    console.log('Estado del jugador guardado en Firebase.');
  } else {
    console.log('No hubo cambios en name o level. No se guarda.');
  }
};

// Función para guardar el estado a intervalos de tiempo
const PlayerStateSaver = () => {
  const { player } = usePlayerStore();
  const { inventories } = useInventoryStore();

  useEffect(() => {
    const playerId = player.playerId || 'guest-player'; // Usa un ID único del jugador o 'guest-player'
    const inventory = inventories[`${player.name}_inventory`];
    // Configurar el intervalo de guardado (por ejemplo, cada 30 segundos)
    const intervalId = setInterval(() => {
      savePlayerStateToFirebase(playerId, player, inventory);
    }, 60000); // 1min

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [player]);

  return null; // Este componente no necesita renderizar nada
};

export default PlayerStateSaver;

export const useInstantSavePlayerState = () => {
  const { player } = usePlayerStore();
  const { inventories } = useInventoryStore();

  const saveState = () => {
    const playerId = player.playerId || 'guest-player';
    const inventory = inventories[`${player.name}_inventory`];
    savePlayerStateToFirebase(playerId, player, inventory);


  };

  return saveState;
};


export const verifyUserName = async (name: string): Promise<boolean> => {
  // Referencia al nodo de los jugadores en la base de datos
  const playerRef = ref(database, `players`);

  try {
    // Obtener los datos de la base de datos
    const snapshot = await get(playerRef);
    const data = snapshot.val();

    // Verificar si el nombre ya existe en la base de datos
    if (data) {
      const playerNames = Object.keys(data); // Obtener las claves (nombres de jugadores) del objeto
      return playerNames.includes(name); // Si el nombre está en la lista, devuelve true
    }

    return false; // Si no hay datos, el nombre no existe
  } catch (error) {
    console.error('Error al verificar el nombre de usuario:', error);
    return false; // Si ocurre un error, asumimos que el nombre no existe
  }
};


export const createPlayerToFirebase = async (inputName: string,password: string) => {
  const { player, playerActions } = usePlayerStore.getState();

  try {

    const auth = getAuth();
    const sanitizedPlayerName = inputName.toLowerCase().replace(/[^a-z0-9_]/g, "");  
    const fakeEmail = `${sanitizedPlayerName}@game.com`;
    // Crear el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, fakeEmail, password);
    const user = userCredential.user;
    const playerId = user.uid;
    playerActions.setPlayerId(playerId)
    // Referencias en la base de datos
    const playerRef = ref(database, `players/${playerId}`);


    // Filtrar datos del jugador antes de guardar
    const filteredPlayer = filterPlayerState(player);

    // Guardar datos en la base de datos
    await set(playerRef, filteredPlayer);

    console.log('Jugador creado y guardado en Firebase:', playerId);
    return playerId;
  } catch (error) {
    console.error('Error al crear el jugador:', error);
    throw error;
  }
};


export const loadPlayerFromFirebase = async (inputName: string, password: string) => {
  const { playerActions } = usePlayerStore.getState();
  const { createInventory, addItem } = useInventoryStore.getState();
  
  try {
    const auth = getAuth();
    const sanitizedPlayerName = inputName.toLowerCase().replace(/[^a-z0-9_]/g, "");
    const fakeEmail = `${sanitizedPlayerName}@game.com`;

    // Iniciar sesión en Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, fakeEmail, password);
    const user = userCredential.user;
    const playerId = user.uid;

    // Obtener referencia a la base de datos
    const playerRef = ref(database, `players/${playerId}`);
    const snapshot = await get(playerRef);

    if (!snapshot.exists()) {
      throw new Error("El jugador no existe en la base de datos.");
    }

    // Cargar datos del jugador en el estado global
    const playerData = snapshot.val();
    playerActions.setPlayer(playerData);

    console.log("Jugador cargado desde Firebase:", playerId);

    const inventoryRef = ref(
      database,
      `players/${playerData.playerId}/${playerData.inventoryId}`,
    );
    const inventorySnapshot = await get(inventoryRef);
          const inventoryData = inventorySnapshot.val();
          const inventoryDefault: Inventory = {
            weapons: inventoryData?.weapons || [],
            armors: inventoryData?.armors || [],
            potions: inventoryData?.potions || [],
            books: inventoryData?.books || [],
            scrolls: inventoryData?.scrolls || [],
            accessories: inventoryData?.accessories || [],
            others: inventoryData?.others || [],
          };
          console.log(inventoryDefault)
          createInventory(`${playerData.name}_inventory`);

          // Agregar ítems al inventario
          Object.entries(inventoryDefault).forEach(([category, items]) => {
            if (Array.isArray(items)) {
              items.forEach((item) => {
                addItem(
                  `${playerData.name}_inventory`,
                  category as keyof Inventory,
                  item,
                );
              });
            }
          });
    console.log(inventorySnapshot)
    return playerData;
  } catch (error) {
    console.error("Error al cargar el jugador:", error);
    throw error;
  }
};
