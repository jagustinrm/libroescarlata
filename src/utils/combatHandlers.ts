import { Dispatch, SetStateAction } from 'react';
import { rollDice } from './rollDice.ts';
import { PlayerActions } from '../stores/types/player.js';
import { Creature } from '../stores/types/creatures.ts';
import useCreatureStore from '../stores/creatures.ts';
import usePlayerStore from '../stores/playerStore.ts';
import useSpellStore from '../stores/spellsStore.ts';
import { useWeaponStore } from '../stores/weaponStore.ts';
import usePositionStore from '../stores/positionStore.ts';

interface CombatHandlersProps {
  playerActions?: PlayerActions;
  setActionMessages?: Dispatch<SetStateAction<string[]>>;
  // selectedSpell?: string;
  handleMessage?: (message: string, type: string, shouldClose: boolean) => void;
  handlePostCombatActs?: (fightType: string, creature: Creature) => void;
  fightType?: string;
  setSummon?: Dispatch<SetStateAction<Creature | null>>;
  switchTurn: () => void;
  turn?: 'enemy' | 'player' | 'summon';
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
  actionType: 'attack' | 'spell' | 'move',
  props: CombatHandlersProps,
  additionalData?: {
    y: number;
    x: number;
    button: Button;
  },
) => {
  const {
    // selectedSpell,
    setActionMessages,
    handleMessage,
    handlePostCombatActs,
    fightType,
    setSummon,
    switchTurn,
    turn,
  } = props;

  let shouldFinalizeTurn = true;
  const addActionMessage = (message: string) => {
    setActionMessages?.((prevMessages) => [...prevMessages, message]);
  };
  const {player} = usePlayerStore.getState();
  const {creature} = useCreatureStore.getState();
  const {spells} = useSpellStore.getState();
  const {weapons} = useWeaponStore.getState();
  const {setPlayerPosition, playerPosition, enemyPosition} = usePositionStore.getState();
  const finalizeTurn = () => {
    if (shouldFinalizeTurn) {
      switchTurn?.();
    }
  };

  const calculateDistance = (
    position1: Position,
    position2: Position,
    diagonalPenalty = 1,
  ) => {
    const dx = Math.abs(position1.x - position2.x);
    const dy = Math.abs(position1.y - position2.y);

    // Ignorar el casillero central del jugador
    if (dx === 0 && dy === 0) return -1;

    // Ajustar por penalización de diagonal
    return dx + dy - Math.min(dx, dy) * (1 - diagonalPenalty);
  };

  // *********************************                  ********************************
  // ************************************CUERPO A CUERPO *****************************
  // ************************************                  *****************************
  const handleAttack = () => {
    if (!player || !creature) return;
   
    const weaponFiltered = weapons?.find((w) => w.name === player.selectedWeapon.name);
    const weaponRange = weaponFiltered?.range ?? 10; // Por defecto, rango es 10.
    const playerAttack = rollDice('1d20') + player.baseAttackBonus;
    console.log(weaponFiltered, playerAttack)
    if (playerPosition && enemyPosition) {
      const adjustedDistance = calculateDistance(playerPosition, enemyPosition);

      if (adjustedDistance === -1) return; // Ignorar posición central del jugador.
   
      if (adjustedDistance > weaponRange) {
        addActionMessage('¡Estás fuera de rango para atacar!');
        handleMessage?.('¡Estás fuera de rango!', 'warning', false);
        shouldFinalizeTurn = false;
        return;
      }
      
      if (
        weaponFiltered &&
        playerAttack > creature.armorClass &&
        creature.health
      ) {
        
        const playerDamage =
          rollDice(weaponFiltered.damage) + player.statsIncrease['str'];
        addActionMessage(
          `Has atacado al enemigo y causado ${playerDamage} puntos de daño.`,
        );
        useCreatureStore
          .getState()
          .setCreatureHealth(Math.max(creature.health - playerDamage, 0));

        if (creature.health - playerDamage <= 0 && fightType) {
          handleMessage?.('¡Has ganado el combate!', 'success', false);
          handlePostCombatActs?.(fightType, creature);
        }
      } else {

        addActionMessage(`¡Tu ataque falló!`);
      }
    }
  };

  // ****************************************    ********************************
  // ****************************************SPELLS********************************
  // ****************************************       ********************************
  const handleSpell = () => {
    const spellDetails = spells?.find((s) => s.name === player.selectedSpell?.name);
    if (!spellDetails) {
      shouldFinalizeTurn = false; // No se encontró el hechizo, no se finaliza el turno.
      return;
    }

    if (
      spellDetails.manaCost &&
      typeof player?.p_LeftMana === 'number' &&
      spellDetails.manaCost > player?.p_LeftMana
    ) {
      addActionMessage(
        `No tienes suficiente maná para lanzar ${spellDetails.name}.`,
      );
      shouldFinalizeTurn = false; // No hay suficiente maná, no se finaliza el turno.
      return;
    }

    // Hechizos ofensivos
    if (
      spellDetails.type === 'Ofensivo' &&
      creature?.health &&
      playerPosition &&
      enemyPosition
    ) {
      const dx = Math.abs(playerPosition.x - enemyPosition.x);
      const dy = Math.abs(playerPosition.y - enemyPosition.y);

      // Ignorar el casillero central del jugador
      if (dx === 0 && dy === 0) {
        addActionMessage(
          `El enemigo está demasiado cerca para atacar con ${spellDetails.name}.`,
        );
        shouldFinalizeTurn = false;
        return;
      }

      // Factor de penalización para diagonales
      const diagonalPenalty = 1; // Ajusta según la reducción deseada
      const adjustedDistance =
        dx + dy - Math.min(dx, dy) * (1 - diagonalPenalty);

      if (adjustedDistance <= spellDetails.range && spellDetails.damage) {
        const damage = rollDice(spellDetails.damage);
        addActionMessage(
          `Has lanzado ${spellDetails.name} y causado ${damage} puntos de daño.`,
        );
        useCreatureStore
          .getState()
          .setCreatureHealth(Math.max(creature.health - damage, 0));
          if (
            typeof player?.p_LeftMana === 'number' &&
            typeof spellDetails.manaCost === 'number'
          ) {
            usePlayerStore
              .getState()
              .playerActions.setP_LeftMana(
                Math.max(player.p_LeftMana - spellDetails.manaCost, 0),
              );
          }
        if (creature.health - damage <= 0 && fightType) {
          handleMessage?.('¡Has ganado el combate!', 'success', false);
          handlePostCombatActs?.(fightType, creature);
        }
        console.log(shouldFinalizeTurn);
        switchTurn?.();
        console.log(shouldFinalizeTurn);
      } else {
        addActionMessage(
          `El enemigo está fuera de rango para ${spellDetails.name}.`,
        );
        handleMessage?.('¡Estás fuera de rango!', 'warning', false);
        shouldFinalizeTurn = false; // Fuera de rango, no se finaliza el turno.
      }

      // Hechizos de curación
    } else if (
      spellDetails.type === 'Curación' &&
      player &&
      spellDetails.healingAmount &&
      spellDetails.manaCost &&
      typeof player?.p_LeftMana === 'number'
    ) {
      const healing = rollDice(spellDetails.healingAmount);
      addActionMessage(
        `Has lanzado ${spellDetails.name} y curado ${healing} puntos de vida.`,
      );
      const totalHealth = Math.min(
        player.p_LeftHealth + healing,
        player.p_MaxHealth,
      );
      usePlayerStore.getState().playerActions.setP_LeftHealth(totalHealth);
      usePlayerStore
        .getState()
        .playerActions.setP_LeftMana(
          Math.max(player?.p_LeftMana - spellDetails.manaCost, 0),
        );

      // Hechizos de invocación
    } else if (
      spellDetails.type === 'Utilidad' &&
      setSummon &&
      spellDetails.manaCost &&
      typeof player?.p_LeftMana === 'number'
    ) {
      addActionMessage(`Has invocado con ${spellDetails.name}.`);
      usePlayerStore
        .getState()
        .playerActions.setP_LeftMana(
          Math.max(player?.p_LeftMana - spellDetails.manaCost, 0),
        );
      setSummon({
        name: 'Mochi',
        img: '/img/summons/mochi.png',
        type: 'slime/animal',
        alignment: 'neutral',
        level: 1,
        hitPoints: '1d4',
        armorClass: 10,
        attacks: [{ name: 'mordisco', type: 'melee', bonus: 1, damage: '1d3' }],
        specialAbilities: ['forma gelatinosa', 'elasticidad', 'salto rápido'],
      });
      switchTurn?.();
    } else {
      shouldFinalizeTurn = false;
    }

    // Finaliza el turno solo si `shouldFinalizeTurn` es true.
    if (shouldFinalizeTurn) {
      finalizeTurn();
    }
  };

  // ************************MOVIMIENTO ***********************************
  const handleMove = () => {
    const button = additionalData;
    if (!button || !playerPosition) return;

    const step = 5;
    const offsetX = 10 / 1.2;
    const offsetY = 20 / 1.5;

    const isWithinRange =
      Math.abs(button.x - playerPosition.x - offsetX) <= 3 * step &&
      Math.abs(button.y - playerPosition.y - offsetY) <= 3 * step;

    if (isWithinRange && turn === 'player') {
      setPlayerPosition?.({
        x: button.x - offsetX,
        y: button.y - offsetY,
      });
    }
  };

  switch (actionType) {
    case 'attack':
      handleAttack();
      break;
    case 'spell':
      handleSpell();
      break;
    case 'move':
      handleMove();
      break;
  }

  finalizeTurn();
};
