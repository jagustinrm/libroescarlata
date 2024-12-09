import { Dispatch, SetStateAction } from "react";
import { rollDice } from "./rollDice.ts";
import { PlayerActions } from "../stores/types/player.js";
import { Player } from "../stores/types/player.js";
import { Spell } from "../stores/types/spells";
import { Creature } from "../stores/types/creatures.ts";
import useCreatureStore from "../stores/creatures.ts";
import usePlayerStore from "../stores/playerStore.ts";
interface CombatHandlersProps {
  player?: Player;
  playerActions?: PlayerActions;
  setActionMessages?: Dispatch<SetStateAction<string[]>>;
  creature?: Creature | null;
  spells?: Spell[];
  charPositions?: { x: number; y: number }[];
  selectedSpell?: string;
  playerPosition?: Position;
  enemyPosition?: Position;
  handleMessage?: (message: string, type: string, shouldClose: boolean) => void;
  handlePostCombatActs?: (fightType: string, creature: Creature) => void;
  fightType?: string ;
  setSummon?: Dispatch<SetStateAction<Creature | null>>;
  setPlayerPosition?: Dispatch<SetStateAction<Position>>;
  setTurn?: Dispatch<SetStateAction<"enemy" | "player" | "summon">>;
  switchTurn: () => void;
  turn?: "enemy" | "player" | "summon";
  button?: Button;
}

interface Position {
  x: number;
  y: number;
}
interface Button {
    x: number;
    y: number;
  }
  
export const handleCombatAction = (
  actionType: "attack" | "spell" | "move",
  props: CombatHandlersProps,
  additionalData?: { button: Button }
) => {
  const {
    player,
    creature,
    spells,
    selectedSpell,
    playerPosition,
    enemyPosition,
    setActionMessages,
    setPlayerPosition,
    handleMessage,
    handlePostCombatActs,
    fightType,
    setSummon,
    playerActions,
    setTurn,
    switchTurn,
    turn,
  } = props;
  


  const addActionMessage = (message: string) => {
    setActionMessages?.((prevMessages) => [...prevMessages, message]);
  };

  const finalizeTurn = () => {
    switchTurn?.();
    console.log(switchTurn)
  };

  const handleAttack = () => {
    if (!player || !creature) return;
    const playerAttack = rollDice("1d20") + player.baseAttackBonus;
    if (playerAttack > creature.armorClass && creature.health) {
      const playerDamage = rollDice(player.selectedWeapon?.damage) + player.statsIncrease["str"];
      addActionMessage(`Has atacado al enemigo y causado ${playerDamage} puntos de daño.`);
      useCreatureStore.getState().setCreatureHealth(Math.max(creature.health - playerDamage, 0));

      if (creature.health - playerDamage <= 0 && fightType) {
        handleMessage?.("¡Has ganado el combate!", "success", false);
        console.log("murió enemigo")
        handlePostCombatActs?.(fightType, creature);
      }
    } else {
      addActionMessage(`¡Tu ataque falló!`);
    }
  };

  const handleSpell = () => {
    const spellDetails = spells?.find((s) => s.name === selectedSpell);
    if (!spellDetails) return;

    if (spellDetails.type === "Ofensivo" && creature?.health && playerPosition && enemyPosition) {

      const distanceX = Math.abs(playerPosition.x - enemyPosition.x);
      const distanceY = Math.abs(playerPosition.y - enemyPosition.y);
      if (distanceX < spellDetails.range && distanceY < spellDetails.range && spellDetails.damage) {
        const damage = rollDice(spellDetails.damage);
        addActionMessage(`Has lanzado ${spellDetails.name} y causado ${damage} puntos de daño.`);
        useCreatureStore.getState().setCreatureHealth(Math.max(creature.health - damage, 0));

        if (creature.health - damage <= 0 && fightType) {
          handleMessage?.("¡Has ganado el combate!", "success", false);
          handlePostCombatActs?.(fightType, creature);
        }
      }
    } else if (spellDetails.type === "Curación" && player && spellDetails.healingAmount) {
      console.log(spellDetails)
      const healing = rollDice(spellDetails.healingAmount);
      addActionMessage(`Has lanzado ${spellDetails.name} y curado ${healing} puntos de vida.`);
      const totalHealth = Math.min(player.p_LeftHealth + healing, player.p_MaxHealth);
      usePlayerStore.getState().playerActions.setP_LeftHealth(totalHealth);
      // ************************SUMMON ****************************** */
    } else if (spellDetails.type === "Utilidad" && setSummon) {
      addActionMessage(`Has invocado con ${spellDetails.name}.`);

      setSummon({
        name: "Mochi",
        img: "/img/summons/mochi.png",
        type: "slime/animal",
        alignment: "neutral",
        level: 1,
        hitPoints: "1d4",
        armorClass: 10,
        attacks: [{ name: "mordisco", type: "melee", bonus: 1, damage: "1d3" }],
        specialAbilities: ["forma gelatinosa", "elasticidad", "salto rápido"],
      });
    }
  };

  const handleMove = () => {
 
    const  button  = additionalData;
    if (!button || !playerPosition) return;

    const step = 5;
    const offsetX = 10 / 1.2;
    const offsetY = 20 / 1.5;

    const isWithinRange =
      Math.abs(button.x - playerPosition.x - offsetX) <= 3 * step &&
      Math.abs(button.y - playerPosition.y - offsetY) <= 3 * step;
    
    if (isWithinRange && turn === "player") {
      setPlayerPosition?.({
        x: button.x - offsetX,
        y: button.y - offsetY,
      });
    }
  };

  switch (actionType) {
    case "attack":
      handleAttack();
      break;
    case "spell":
      handleSpell();
      break;
    case "move":
      handleMove();
      break;
  }

  finalizeTurn();
};
