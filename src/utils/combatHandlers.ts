import { Dispatch, SetStateAction } from 'react';
import { Creature } from '../stores/types/creatures.ts';
import useCreatureStore from '../stores/creatures.ts';
import { isAttackSuccessful } from './calculateStats.ts';
import { simulateAttackMovement } from './simulateAttackMovement.ts';
import { calculateDistance } from './calculateDistance.ts';
import { getGlobalState } from '../customHooks/useGlobalState.ts';

interface CombatHandlersProps {
  handleMessage?: (message: string, type: string, shouldClose: boolean) => void;
  handlePostCombatActs?: (creature: Creature) => void;
  button?: Button;
  setActivateImage: Dispatch<SetStateAction<boolean>>;
}
interface Button {
  x: number;
  y: number;
}

export const handleCombatAction = (
  actionType: 'attack' | 'spell' | 'move' | 'scroll',
  props: CombatHandlersProps,
  additionalData?: any,
) => {
  const {
    handleMessage,
    setActivateImage,
  } = props;

  let shouldFinalizeTurn = true;
  const addActionMessage = (message: string) => {
    setActionMessages?.((prevMessages) => [...prevMessages, message]);
  };
  const { spells, weapons, summons, setSummon, 
    player, playerActions, creature, 
    setActionMessages, setFloatingMessage,
    setPlayerPosition,currentCharacter, nextTurn, 
    addCharacter, playerPosition, enemyPosition, 
    setPetPosition } = getGlobalState();  

  const finalizeTurn = () => {
    if (shouldFinalizeTurn) {
      playerActions.decrementBuffDurations();
      nextTurn();
    }
  };

  const handleAttack = (): boolean => {
    if (!player || !creature) return false;

    const weaponFiltered = weapons?.find(
      (w) => w.name === player.bodyParts.manoDerecha.name,
    );
    const weaponRange = weaponFiltered?.range ?? 10;

    if (playerPosition && enemyPosition) {
      const adjustedDistance = calculateDistance(playerPosition, enemyPosition);

      if (adjustedDistance > weaponRange) {
        addActionMessage('¡Estás fuera de rango para atacar!');
        handleMessage?.('¡Estás fuera de rango!', 'warning', false);
        shouldFinalizeTurn = false;
        return false;
      }

      setTimeout(() => {
        simulateAttackMovement(playerPosition, 5, setPlayerPosition);
      }, 100);

      const success = isAttackSuccessful(
        player.hitRatePercentage?.() ?? 0,
        creature.dodgePercentage?.() ?? 0,
      );

      if (weaponFiltered && success && creature.p_LeftHealth) {
        setActivateImage(true);
        setTimeout(() => {
          setActivateImage(false);
        }, 250);

        const redDamage = creature.totalDmgReduction(player.level);
        const totalDamage = Math.floor(
          Math.random() * (player.damageMax() - player.damage()) +
            player.damage(),
        );
        const finalDamage = Math.floor(totalDamage * (1 - redDamage / 100));
        useCreatureStore
          .getState()
          .setP_LeftHealth(Math.max(creature.p_LeftHealth - finalDamage, 0));

        addActionMessage(
          `Has atacado al enemigo y causado ${finalDamage} puntos de daño.`,
        );
        setFloatingMessage({
          message: finalDamage.toString(),
          onComplete: () => setFloatingMessage(null),
          textColor: 'red',
          position: enemyPosition,
        });


        return true; // Ataque exitoso
      } else {
        setFloatingMessage({
          message: '¡Falló!',
          onComplete: () => setFloatingMessage(null),
          textColor: 'red',
          position: enemyPosition,
        });
        addActionMessage(`¡Tu ataque falló!`);
        return false; // Ataque fallido
      }
    }

    return false; // No se pudo realizar el ataque
  };

  const handleSpell = (): boolean => {
    const scroll = additionalData;
    let spellDetails = null;

    if (actionType === 'scroll' && scroll) {
      spellDetails = scroll;
    } else {
      spellDetails = spells?.find((s) => s.name === player.selectedSpell?.name);

      if (
        spellDetails &&
        spellDetails.manaCost &&
        typeof player?.p_LeftMana === 'number' &&
        spellDetails.manaCost > player?.p_LeftMana
      ) {
        addActionMessage(
          `No tienes suficiente maná para lanzar ${spellDetails.name}.`,
        );
        handleMessage?.('¡No tienes suficiente maná!', 'warning', false);
        shouldFinalizeTurn = false;
        return false;
      }

      if (!spellDetails) {
        shouldFinalizeTurn = false;
        return false;
      }
    }

    if (
      spellDetails.type === 'Ofensivo' &&
      creature?.health &&
      playerPosition &&
      enemyPosition
    ) {
      const dx = Math.abs(playerPosition.x - enemyPosition.x);
      const dy = Math.abs(playerPosition.y - enemyPosition.y);

      if (dx === 0 && dy === 0) {
        addActionMessage(
          `El enemigo está demasiado cerca para atacar con ${spellDetails.name}.`,
        );
        shouldFinalizeTurn = false;
        return false;
      }

      const diagonalPenalty = 1;
      const adjustedDistance =
        dx + dy - Math.min(dx, dy) * (1 - diagonalPenalty);

      if (
        adjustedDistance <= spellDetails.range &&
        spellDetails.damage &&
        spellDetails.damageMax
      ) {
        const damage =
          Math.floor(
            Math.random() *
              (spellDetails.damageMax +
                player.mDamageMax() -
                spellDetails.damage +
                player.mDamage() +
                1),
          ) +
          spellDetails.damage +
          player.mDamage();
        const redDamage = creature.totalDmgReduction(player.level);
        const finalDamage = Math.floor(damage * (1 - redDamage / 100));

        simulateAttackMovement(playerPosition, 5, setPlayerPosition);
        addActionMessage(
          `Has lanzado ${spellDetails.name} y causado ${finalDamage} puntos de daño.`,
        );
        setFloatingMessage({
          message: damage.toString(),
          onComplete: () => setFloatingMessage(null),
          textColor: 'red',
          position: enemyPosition,
        });

        useCreatureStore
          .getState()
          .setP_LeftHealth(Math.max(creature.p_LeftHealth - finalDamage, 0));

        if (
          typeof player?.p_LeftMana === 'number' &&
          typeof spellDetails.manaCost === 'number' &&
          !scroll
        ) {
          playerActions.setP_LeftMana(
              Math.max(player.p_LeftMana - spellDetails.manaCost, 0),
            );
        }



        return true; // Hechizo exitoso
      } else {
        addActionMessage(
          `El enemigo está fuera de rango para ${spellDetails.name}.`,
        );
        handleMessage?.('¡Estás fuera de rango!', 'warning', false);
        shouldFinalizeTurn = false;
        return false; // Hechizo fallido
      }
    } else if (
      spellDetails.type === 'Curación' &&
      player &&
      spellDetails.healingAmount &&
      spellDetails.manaCost &&
      typeof player?.p_LeftMana === 'number'
    ) {
      const healing = spellDetails.healingAmount;
      addActionMessage(
        `Has lanzado ${spellDetails.name} y curado ${healing} puntos de vida.`,
      );

      setFloatingMessage({
        message: healing.toString(),
        onComplete: () => setFloatingMessage(null),
        textColor: 'green',
        position: playerPosition,
      });

      const totalHealth = Math.min(
        player.p_LeftHealth + healing,
        player.totalMaxHealth(),
      );
      playerActions.setP_LeftHealth(totalHealth);
      playerActions.setP_LeftMana(
          Math.max(player?.p_LeftMana - spellDetails.manaCost, 0),
        );

      return true; // Hechizo de curación exitoso
    } else if (
      spellDetails.type === 'Utilidad' &&
      setSummon &&
      spellDetails.manaCost &&
      typeof player?.p_LeftMana === 'number'
    ) {
      addActionMessage(`Has invocado con ${spellDetails.name}.`);
      playerActions.setP_LeftMana(
          Math.max(player?.p_LeftMana - spellDetails.manaCost, 0),
        );

      const summon = summons.find((s) => s.name === spellDetails.invocation);
      
      if (summon) {
        addCharacter({ id: 'summon', name: summon.name });
        setSummon(summon);
      }

      return true; // Hechizo de invocación exitoso
    } else {
      shouldFinalizeTurn = false;
      return false; // Hechizo fallido
    }
  };

  const handleMove = (): boolean => {
    const button = additionalData;
    if (!button || !playerPosition) return false;

    const step = 5;
    const offsetX = 10 / 1.2;
    const offsetY = 20 / 1.5;

    const isWithinRange =
      Math.abs(button.x - playerPosition.x - offsetX) <= 3.5 * step &&
      Math.abs(button.y - playerPosition.y - offsetY) <= 3.5 * step;

    if (isWithinRange && currentCharacter && currentCharacter.id === 'player') {
      setPlayerPosition?.({
        x: button.x - offsetX,
        y: button.y - offsetY,
      });
      setPetPosition?.({
        x: button.x - offsetX + 8,
        y: button.y - offsetY + 12,
      });

      return true; // Movimiento exitoso
    }

    return false; // Movimiento fallido
  };

  let result = false;

  switch (actionType) {
    case 'attack':
      result = handleAttack();
      break;
    case 'spell':
      result = handleSpell();
      break;
    case 'move':
      result = handleMove();
      break;
    case 'scroll':
      result = handleSpell();
      break;
  }

  finalizeTurn();
  return result; // Retorna el resultado de la acción
};
