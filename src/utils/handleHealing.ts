import { rollDice } from '../utils/rollDice';
import usePlayerStore from '../stores/playerStore';
import usePotionStore from '../stores/potionsStore';
import { Item } from '../stores/types/items';

interface HandleHealingParams {
  item: Item;
  handleMessage: (message: string, type: string, persist: boolean) => void;
}
export const handleHealing = ({
  item,
  handleMessage,
}: HandleHealingParams) => {

  const {player, playerActions} = usePlayerStore.getState();
  const currentHealth = player.p_LeftHealth;
  const maxHealth = player.totalMaxHealth();

  // Verificar si se necesita curación
  if (item.type === "Curación") {
    if (!item) return;
    if (currentHealth < player.totalMaxHealth()) {
        const totalLeftHealth = currentHealth + item.effect?.amount;
        playerActions.setP_LeftHealth(Math.min(totalLeftHealth, player.totalMaxHealth()));
    } else {
      handleMessage('Tu vida está completa', 'success', false);
    }
  } else if (item.type === "Buff") {
    playerActions.addBuff(item.effect.stat, item.effect.value, item.effect.duration)
  }
};  
