import useAppStore from '../stores/appStore';
import usePlayerStore from '../stores/playerStore';
import usePositionStore from '../stores/positionStore';
import useTurnStore from '../stores/turnStore';
import { Item } from '../stores/types/items';
import { calculateTotalMaxHealth } from './calculateStats';

interface HandleHealingParams {
  item: Item;
  handleMessage: (message: string, type: string, persist: boolean) => void;
}
export const handlePotion = ({
  item,
  handleMessage,
}: HandleHealingParams): boolean => {
  const { player, playerActions } = usePlayerStore.getState();
  const currentHealth = player.c_LeftHealth;
  const { nextTurn } = useTurnStore.getState();
  const { setFloatingMessage, setSoundUrl } = useAppStore.getState();
  const { playerPosition } = usePositionStore.getState();
  if (item.type === 'Curación') {
    if (!item) return false;

    if (currentHealth < calculateTotalMaxHealth(player.stats.con, player.stats.cha, player.c_MaxHealth)) {
      const totalLeftHealth = currentHealth + item.effect?.amount;
      playerActions.setc_LeftHealth(
        Math.min(totalLeftHealth, calculateTotalMaxHealth(player.stats.con, player.stats.cha, player.c_MaxHealth)),
      );
      nextTurn();
      setFloatingMessage({
        message: item.effect?.amount.toString(),
        onComplete: () => setFloatingMessage(null),
        textColor: 'green',
        position: playerPosition,
      });
      setSoundUrl('/music/attacks/potion-drink.wav');
      return true;
    } else {
      handleMessage('Tu vida está completa', 'success', false);
      return false;
    }
  } else if (item.type === 'Buff') {
    playerActions.addBuff(
      item.effect.stat,
      item.effect.value,
      item.effect.duration,
    );
    nextTurn();
    return true; // Ítem fue utilizado
  }
  return false; // Por defecto, no se utilizó el ítem
};
