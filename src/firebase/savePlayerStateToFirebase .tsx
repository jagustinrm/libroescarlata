import { database } from './firebaseConfig';
import { useEffect } from 'react';
import { ref, set, get, getDatabase } from 'firebase/database';
import usePlayerStore from '../stores/playerStore';
import { Player } from '../stores/types/player';
import useInventoryStore from '../stores/inventoryStore';
import { Inventory } from '../stores/types/inventory';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// Función para comparar propiedades específicas de dos objetos
const comparePlayerState = (player1: any, player2: any) => {
  // Compara solo las propiedades 'name' y 'level'

  if (!player1) return false;
  return (
    player1.name === player2.name &&
    player1.level === player2.level &&
    player1.playerExp === player2.playerExp
  );
};

// Función para guardar el estado en Firebase
const filterPlayerState = (player: Player): Partial<Player> => {
  const {
    name,
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
  password?: string,
) => {
  const db = getDatabase();
  const auth = getAuth();
  const fakeEmail = `${player.name.toLowerCase().replace(/\s/g, "_")}@game.com`;
  const userCredential = await createUserWithEmailAndPassword(auth, fakeEmail, password);
  const user = userCredential.user;
  const playerUid = user.uid;
  
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
    const playerId = player.name || 'guest-player'; // Usa un ID único del jugador o 'guest-player'
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

  const saveState = (password?: string) => {
    const playerId = player.name || 'guest-player';
    const inventory = inventories[`${player.name}_inventory`];
    if (password) {
      savePlayerStateToFirebase(playerId, player, inventory, password);
    } else {
      savePlayerStateToFirebase(playerId, player, inventory);
    }

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
