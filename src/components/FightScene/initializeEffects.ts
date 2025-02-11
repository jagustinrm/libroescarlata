import { useEffect } from "react";
import { Weapon } from "../../stores/types/weapons";
import { Spell } from "../../stores/types/spells";
import { getGlobalState } from "../../customHooks/useGlobalState";
import useSummonStore from "../../stores/summonsStore";

interface InitializeEffectsProps {
  setpocion: (value: any) => void;
  setOpcionesArmas: (value: Weapon[]) => void;
  setOpcionesSpells: (value: Spell[]) => void;
  handleCheckLevelUp: () => void;

  handleMessage: (message: string, type: string, flag: boolean) => void;
  logRef: React.RefObject<HTMLUListElement>;
  actionMessages: any;
};

export const initializeEffects = ({
  setpocion,
  setOpcionesArmas,
  setOpcionesSpells,
  handleCheckLevelUp,
  handleMessage,
  logRef,
  actionMessages
}: InitializeEffectsProps) => {
  const { player, playerPosition,  addCharacter, weapons, creature, spells, inventories, resetPositions, setAmbientMusic, setMusicVolume, setSummonPosition } = getGlobalState();
  const {summon} = useSummonStore.getState();
  // 1️⃣ Configuración inicial de inventarios y opciones
  useEffect(() => {
    const pot = inventories[player.inventoryId].potions.find(
      (p: string) => p === "Poción de Curación Menor"
    );
    setpocion(pot);

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
    resetPositions();
    addCharacter({ id: "player", name: player.name });
    addCharacter({ id: "enemy", name: creature.name });
    if (player.selectedPet) {
      addCharacter({ id: "pet", name: player.selectedPet.name });
    }
    setAmbientMusic("battleSong");
    setMusicVolume(0.1);
  }, []);

  // 4️⃣ Manejo de derrota del jugador
  useEffect(() => {
    if (player.p_LeftHealth === 0) {
      handleMessage("¡Has sido derrotado!", "warning", true);
    }
  }, [player.p_LeftHealth]);

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
};
