import { calculateCost } from './calculateCost';
export const calculateArmorValue = (
  material: string,
  equipLevel: number,
  rarity: string,
): number => {
  const materialMultiplier: { [key: string]: number } = {
    Metal: 2,
    Madera: 1.2,
    Cuero: 1,
    Tela: 0.5,
  };
  const baseValue = equipLevel * (materialMultiplier[material] || 1);
  const rarityBonus = calculateCost(equipLevel, rarity) / 10;
  return Math.floor(baseValue + rarityBonus);
};
