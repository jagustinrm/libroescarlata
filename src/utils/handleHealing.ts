import { Player } from '../stores/types/player';
import { Potion } from '../stores/types/potions';
import { Inventory } from '../stores/types/inventory';
import { rollDice } from '../utils/rollDice';

interface HandleHealingParams {
  player: Player;
  inventories: Record<string, Inventory>;
  potions: Potion[];
  removeItem: (
    inventoryId: string,
    type: keyof Inventory,
    item: string,
  ) => void;
  playerActions: { setP_LeftHealth: (health: number) => void };
  handleMessage: (message: string, type: string, persist: boolean) => void;
}

export const handleHealing = ({
  player,
  inventories,
  potions,
  removeItem,
  playerActions,
  handleMessage,
}: HandleHealingParams) => {
  const potionName = 'Poción de Curación Menor';
  const currentHealth = player.p_LeftHealth;
  const maxHealth = player.totalMaxHealth();

  // Función para eliminar la poción
  const removePotion = () => {
    const potionIndex = inventories[player.inventoryId]?.potions.findIndex(
      (p) => p === potionName,
    );
    if (potionIndex !== -1) {
      removeItem(
        player.inventoryId,
        'potions',
        inventories[player.inventoryId].potions[potionIndex],
      );
    } else {
      console.log('Poción no encontrada.');
    }
  };

  // Verificar si se necesita curación
  if (currentHealth < maxHealth) {
    const foundPotion = potions.find((p) => p.name === potionName);
    if (!foundPotion) return;

    const amountHealingDice = foundPotion.effect?.amount;
    if (amountHealingDice) {
      const amountHealing = rollDice(amountHealingDice);
      const totalLeftHealth = currentHealth + amountHealing;

      // Establecer la nueva salud, sin exceder la salud máxima
      playerActions.setP_LeftHealth(Math.min(totalLeftHealth, maxHealth));

      // Eliminar la poción utilizada
      removePotion();
    }
  } else {
    handleMessage('Tu vida está completa', 'success', false);
  }
};
