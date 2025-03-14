import { useEffect } from "react";
import { Weapon } from "../../stores/types/weapons";
import { Spell } from "../../stores/types/spells";
import { getGlobalState } from "../../customHooks/useGlobalState";
import useSummonStore from "../../stores/summonsStore";
import { selectEnemy } from "../handlers/handleSelectEnemy";

interface InitializeEffectsProps {

  setOpcionesArmas: (value: Weapon[]) => void;
  setOpcionesSpells: (value: Spell[]) => void;
  handleCheckLevelUp: () => void;
  handleMessage: (message: string, type: string, flag: boolean) => void;
  logRef: React.RefObject<HTMLUListElement>;
  handlePostCombatActs: any;
  enemy: string | null,
};

export const initializeEffects = ({
  setOpcionesArmas,
  setOpcionesSpells,
  handleCheckLevelUp,
  handleMessage,
  logRef,
  handlePostCombatActs,
  enemy,
}: InitializeEffectsProps) => {
  const { player, playerPosition,  addCharacter,
    creatureLoaded, setCreatureLoaded,  weapons, creature,
    spells, inventories, resetPositions, setAmbientMusic, 
    setMusicVolume, setSummonPosition, fightType, 
    actionMessages, playerActions, setTurn, currentCharacter } = getGlobalState();
  const {summon} = useSummonStore.getState();
  // 1️⃣ Configuración inicial de inventarios y opciones
  useEffect(() => {
    const opctArm = inventories[player.inventoryId].weapons
      .map((w) => weapons.find((ws) => ws.id === w))
      .filter((w): w is Weapon => w !== undefined);
    setOpcionesArmas(opctArm);

    const opctSpells = player.spells
      .map((s) => spells.find((sp) => sp.id === s))
      .filter((s): s is Spell => s !== undefined);
    setOpcionesSpells(opctSpells);
  }, [inventories]);

  // 2️⃣ Verificar subida de nivel cuando cambia la experiencia del jugador
  useEffect(() => {
    handleCheckLevelUp();
  }, [player.playerExp]);

  // 3️⃣ Configuración inicial de batalla
  useEffect(() => {
    addCharacter({ id: "player", name: player.name });
    addCharacter({ id: "enemy", name: creature.name });
    if (player.selectedPet) {
      addCharacter({ id: "pet", name: player.selectedPet.name });
    }
    // handleNewEnemyClick()
    setAmbientMusic("battleSong");
    setMusicVolume(0.1);
 
    selectEnemy(
      player.level,
      player.dungeonLevel,
      enemy);
  }, []);

  // 4️⃣ Manejo de derrota del jugador o del enemigo
  useEffect(() => {
    if(creatureLoaded) {
    if (player.c_LeftHealth === 0) {
      handleMessage("¡Has sido derrotado!", "warning", true);
      
    }

    if (
      typeof creature.c_LeftHealth === 'number' &&
      creature.c_LeftHealth <= 0 &&
      fightType
    ) {
      handleMessage('¡Has ganado el combate!', 'success', false);
      handlePostCombatActs?.(creature, fightType);
      
    }
  }
  }, [player.c_LeftHealth, creature.c_LeftHealth]);


  // 5️⃣ Ajustar posición de invocación
  useEffect(() => {
    if (summon) {
      // Aquí puedes estar seguro de que summon tiene un valor válido
      setSummonPosition({
        x: playerPosition.x + 6,
        y: playerPosition.y + 4,
      });
    }
  }, [summon]);

  // 6️⃣ Auto-scroll en el log de mensajes
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [actionMessages]);

  useEffect(() => {
    return () => {
      setCreatureLoaded(false); 
      resetPositions();
      playerActions.resetBuffs();
      setTurn("player")
    };
  }, []);
  
  useEffect(() => {
   if (currentCharacter?.id === 'player' && player.c_LeftHealth > 0 && player.c_LeftHealth < player.totalMaxHealth()) {
    playerActions.setc_LeftHealth(Math.min(player.c_LeftHealth + player.healthReg(), player.totalMaxHealth()))
    playerActions.setc_LeftMana(Math.min(player.c_LeftMana + player.spiritReg(), player.totalMaxMana()))
  } 
  }, [currentCharacter]);
 
};
