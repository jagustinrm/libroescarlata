import { Player } from '../stores/types/player';
import { PlayerActions } from '../stores/types/player';

interface ExpTable {
  [key: string]: number;
}

interface CheckLevelUpParams {
  // calculateInitialHealth: (die: number) => number;
  player: Player;
  setActionMessages: (callback: (messages: string[]) => string[]) => void;
  playerActions: PlayerActions;
  expTable: ExpTable | undefined;
}

export function checkLevelUp({
  // calculateInitialHealth,
  player,
  setActionMessages,
  playerActions,
  expTable,
}: CheckLevelUpParams): number {
  // Verificar si la experiencia actual es suficiente para subir de nivel
  const gainXpToNextLevel = (level: number) => {
    const levelSum = level + 1;
    if (!expTable) return;
    const nextLevelXp = expTable[levelSum.toString()] || expTable['20']; // Evitar que supere el nivel 20
    const prevLevelXp =
      (level > 1 && expTable[level.toString()]) || expTable['20'];
    playerActions.setP_ExpToNextLevel(nextLevelXp);
    playerActions.setP_ExpPrevLevel(prevLevelXp);
    playerActions.addStatsLeftPoints(5);
  };

  if (player.playerExp >= player.p_ExpToNextLevel && player.level < 20) {
    const newLevel = player.level + 1;

    // Aumentar salud con un mínimo de 1
    const healthIncrease = Math.floor(Math.random() * player.hitDie);
    const newPlayerHealth =
      parseInt(player.c_MaxHealth.toString(), 10) + Math.max(1, healthIncrease);
    playerActions.setc_LeftHealth(newPlayerHealth);
    playerActions.setc_MaxHealth(newPlayerHealth);

    // Aumentar mana con un mínimo de 1
    const manaIncrease = Math.floor(Math.random() * player.manaDie);
    const newPlayerMana =
      parseInt(player.c_MaxMana.toString(), 10) + Math.max(1, manaIncrease);
    playerActions.setc_LeftMana(newPlayerMana);
    playerActions.setc_MaxMana(newPlayerMana);

    playerActions.setPlayerLevel(newLevel);
    gainXpToNextLevel(newLevel); // Actualizar la experiencia necesaria para el próximo nivel

    playerActions.setDodge(player.dodge + player.dodgeDie);
    playerActions.setHitRate(player.hitRate + player.hitRateDie);
    setActionMessages((prevMessages) => [
      ...prevMessages,
      `¡Has subido al nivel ${newLevel}, ¡Tu nivel de vida aumentó a ${newPlayerHealth} y tu mana a ${newPlayerMana}!`,
    ]);
  }
  return player.level;
}
