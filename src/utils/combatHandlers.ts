import { Dispatch, SetStateAction } from 'react';
import { rollDice } from './rollDice.ts';
import { PlayerActions } from '../stores/types/player.js';
import { Creature } from '../stores/types/creatures.ts';
import useCreatureStore from '../stores/creatures.ts';
import usePlayerStore from '../stores/playerStore.ts';
import useSpellStore from '../stores/spellsStore.ts';
import { useWeaponStore } from '../stores/weaponStore.ts';
import usePositionStore from '../stores/positionStore.ts';
import { isAttackSuccessful } from './calculateDodgePercentage.ts';
import { simulateAttackMovement } from './simulateAttackMovement.ts';
import { FloatingMessageProps } from '../stores/types/others';
import useTurnStore from '../stores/turnStore.ts';

interface CombatHandlersProps {
  playerActions?: PlayerActions;
  setActionMessages?: Dispatch<SetStateAction<string[]>>;
  // selectedSpell?: string;
  handleMessage?: (message: string, type: string, shouldClose: boolean) => void;
  handlePostCombatActs?: (fightType: string, creature: Creature) => void;
  fightType?: string;
  setSummon?: Dispatch<SetStateAction<Creature | null>>;
  // switchTurn: () => void;
  // turn?: 'enemy' | 'player' | 'summon';
  button?: Button;
  setActivateImage: Dispatch<SetStateAction<boolean>>;
  setFloatingMessage: Dispatch<SetStateAction<FloatingMessageProps | null>> ;
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
    // switchTurn,
    // turn,
    setActivateImage,
    setFloatingMessage,
  } = props;

  let shouldFinalizeTurn = true;
  const addActionMessage = (message: string) => {
    setActionMessages?.((prevMessages) => [...prevMessages, message]);
  };
  const {player} = usePlayerStore.getState();
  const {creature} = useCreatureStore.getState();
  const {spells} = useSpellStore.getState();
  const {weapons} = useWeaponStore.getState();
  const {currentCharacter, nextTurn, addCharacter} = useTurnStore.getState();
  const {setPlayerPosition, playerPosition, enemyPosition, setPetPosition} = usePositionStore.getState();
  const finalizeTurn = () => {
    if (shouldFinalizeTurn) {
        // switchTurn?.();
        nextTurn();
        
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
   
    const weaponFiltered = weapons?.find((w) => w.name === player.bodyParts.manoDerecha.name);
    const weaponRange = weaponFiltered?.range ?? 10; // Por defecto, rango es 10.
    
    if (playerPosition && enemyPosition) {
      const adjustedDistance = calculateDistance(playerPosition, enemyPosition);

      if (adjustedDistance === -1) return; // Ignorar posición central del jugador.
   
      if (adjustedDistance > weaponRange) {
        addActionMessage('¡Estás fuera de rango para atacar!');
        handleMessage?.('¡Estás fuera de rango!', 'warning', false);
        shouldFinalizeTurn = false;
        return;
      }
      setTimeout(() => {
      simulateAttackMovement(playerPosition, 5, setPlayerPosition);
    }, 100); 
      const success = isAttackSuccessful(
        player.hitRatePercentage?.() ?? 0,  
        creature.dodgePercentage?.() ?? 0    
      );
      
      if (
        weaponFiltered &&
        success &&
        creature.health
      ) {


        setActivateImage(true);
        setTimeout(() => {
          setActivateImage(false);
        }, 250);
        const totalDamage = Math.floor(Math.random() * (player.damageMax() - player.damage()) + player.damage());
        addActionMessage(
          `Has atacado al enemigo y causado ${totalDamage} puntos de daño.`,
        );
        setFloatingMessage({message: totalDamage.toString(), onComplete: () => setFloatingMessage(null), textColor: "red", position: enemyPosition},  )
        useCreatureStore
          .getState()
          .setCreatureHealth(Math.max(creature.health - totalDamage, 0));

        if (creature.health - totalDamage <= 0 && fightType) {
          handleMessage?.('¡Has ganado el combate!', 'success', false);
          handlePostCombatActs?.(fightType, creature);
        }
      } else {
        setFloatingMessage({message: '¡Falló!', onComplete: () => setFloatingMessage(null), textColor: "red", position: enemyPosition},  )
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

      if (adjustedDistance <= spellDetails.range && spellDetails.damage && spellDetails.damageMax ) {
        const damage = 
        Math.floor(Math.random() * (spellDetails.damageMax - spellDetails.damage + 1)) 
        + spellDetails.damage 
        simulateAttackMovement(playerPosition, 5, setPlayerPosition);
        addActionMessage(
          `Has lanzado ${spellDetails.name} y causado ${damage} puntos de daño.`,
        );
        setFloatingMessage({message: damage.toString(), onComplete: () => setFloatingMessage(null), textColor: "red", position: enemyPosition},  )

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
      setFloatingMessage({message: healing.toString(), onComplete: () => setFloatingMessage(null), textColor: "green", position: playerPosition},  )

      const totalHealth = Math.min(
        player.p_LeftHealth + healing,
        player.totalMaxHealth(),
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
      const summon = {
        ...creature,
        name: 'Mochi',
        img: '/img/summons/mochi.png',
        type: 'slime/animal',
        alignment: 'neutral',
        level: 1,
        hitPoints: '1d4',
        armorClass: 10,
        attacks: [{ name: 'mordisco', type: 'melee', bonus: 1, damage: 3, damageMax: 5, soundEffect: "/music/attacks/bite.wav" }],
        specialAbilities: ['forma gelatinosa', 'elasticidad', 'salto rápido'],
        dodge: 20,
        hitRate: 40,
        stats: {
          str: 1,
          agi: 1,
          dex: 1,
          con: 1,
          cha: 1,
          int: 1
        },
      }  
      addCharacter({id: "summon", name: summon.name})
      setSummon(summon);
      
    } else {
      shouldFinalizeTurn = false;
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

    if (isWithinRange && currentCharacter && currentCharacter.id === 'player') {
      setPlayerPosition?.({
        x: button.x - offsetX,
        y: button.y - offsetY,
      });
      setPetPosition?.({
        x: button.x - offsetX + 8,
        y: button.y - offsetY + 12,
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
