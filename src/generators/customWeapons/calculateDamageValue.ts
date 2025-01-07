import { calculateCost } from '../calculateCost';

export const calculateDamageValue = (
  material: 'Hierro' | 'Acero' | 'Madera' | 'Cristal' | string, // Restricción explícita a estos materiales
  equipLevel: number,
  rarity: string,
): number => {
  const materialMultiplier: { [key in 'Hierro' | 'Acero' | 'Madera' | 'Cristal' | string]: number } = {
    Madera: 1.5,
    Hierro: 3,
    Acero: 5,
    Cristal: 10,
  };

  // Calcula el valor base en función del nivel del equipo y el multiplicador del material
  const baseDamage = equipLevel * materialMultiplier[material];

  // Calcula el bono de rareza usando la función externa calculateCost
  const rarityBonus = calculateCost(equipLevel, rarity) / 5; // Ajusta el impacto de la rareza

  // Devuelve el valor total redondeado al entero más cercano
  return Math.floor(baseDamage + rarityBonus);
};

export const calculateDamageValues = (
  material: 'Hierro' | 'Acero' | 'Madera' | 'Cristal' | string,
  equipLevel: number,
  rarity: string,
): { damage: number, damageMax: number } => {
  // Calcula el daño base usando la función original
  const baseDamage = calculateDamageValue(material, equipLevel, rarity);

  // Ajusta el daño máximo, por ejemplo, con un multiplicador adicional
  const maxDamageMultiplier = 1.2; // Ajusta este valor según sea necesario
  const maxDamage = Math.floor(baseDamage * maxDamageMultiplier);

  // Devuelve un objeto con el daño mínimo y máximo
  return { damage: baseDamage, damageMax: maxDamage };
};