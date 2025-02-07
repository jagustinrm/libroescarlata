import { bodyParts } from '../stores/types/others';

export function calculateTotalDodge(agi: number = 1, dodge: number): number {
  // Constantes específicas del juego
  const DODGE_PER_AGILITY = 0.1; // Ejemplo: 1.2% por cada 100 puntos de agilidad

  // Cálculo del porcentaje de esquiva
  const dodgeFromAgility = agi * DODGE_PER_AGILITY;

  const totalDodge = dodge + dodgeFromAgility;
  // Asegurarse de que el porcentaje esté en un rango válido
  return totalDodge;
}
export function calculateDodgePercentage(
  dodge: number,
  enemyLevel: number = 1,
): number {
  // return parseFloat(Math.max(0, Math.min(dodge, 100)).toFixed(2));
  // Se aplica una penalización que se incrementa conforme el nivel del enemigo crece.
  const penalty = Math.pow(0.95, enemyLevel - 1); // Penaliza con un factor decreciente exponencialmente
  // Calculamos la probabilidad de golpear usando la evasión (flee o estimada) y la penalización.
  const dodgeChance = (dodge / (dodge + enemyLevel * 10)) * 100 * penalty;
  // Aseguramos que el hitChance esté entre 5% y 95%
  const finalDodgeRate = Math.max(5, Math.min(95, dodgeChance));

  return parseFloat(finalDodgeRate.toFixed(2));
}

export function calculateTotalHitRate(
  dex: number = 1,
  hitRate: number,
): number {
  const HIT_RATE_PER_DEX = 1;
  const hitRateFromDex = dex * HIT_RATE_PER_DEX;
  const totalHitRate = hitRateFromDex + hitRate;
  return totalHitRate;
}
export function calculateHitRatePercentage(
  totalHitRate: number,
  enemyLevel: number = 1,
): number {
  // Se aplica una penalización que se incrementa conforme el nivel del enemigo crece.
  const penalty = Math.pow(0.95, enemyLevel - 1); // Penaliza con un factor decreciente exponencialmente
  // Calculamos la probabilidad de golpear usando la evasión (flee o estimada) y la penalización.
  const hitChance =
    (totalHitRate / (totalHitRate + enemyLevel * 10)) * 100 * penalty;
  // Aseguramos que el hitChance esté entre 5% y 95%
  const finalHitRate = Math.max(5, Math.min(95, hitChance));

  return parseFloat(finalHitRate.toFixed(2)); // Redondeamos el resultado a 2 decimales
}
export function calculateTotalMaxHealth(
  con: number = 1,
  cha: number = 1,
  p_MaxHealth: number,
): number {
  const HEALTH_PER_CON = 5;
  const HEALTH_PER_CHA = 1;
  const healthFromCon = con * HEALTH_PER_CON;
  const healthFromCha = cha * HEALTH_PER_CHA;
  const totalMaxHealth = p_MaxHealth + healthFromCon + healthFromCha;
  return totalMaxHealth;
}
export function calculateTotalMaxMana(
  int: number = 1,
  cha: number = 1,
  p_MaxMana: number,
): number {
  const MANA_PER_INT = 5;
  const MANA_PER_CHA = 1;
  const manaFromInt = int * MANA_PER_INT;
  const manaFromCha = cha * MANA_PER_CHA;
  const totalMaxMana = p_MaxMana + manaFromInt + manaFromCha;
  return totalMaxMana;
}

export function isAttackSuccessful(
  hitRatePercentage: number, // Porcentaje de hit rate del atacante
  dodgePercentage: number, // Porcentaje de esquiva del defensor
): boolean {
  // Asegurarse de que los porcentajes estén en un rango válido
  const effectiveHitRate = Math.max(0, Math.min(hitRatePercentage, 100));
  const effectiveDodge = Math.max(0, Math.min(dodgePercentage, 100));
  console.log(effectiveHitRate, effectiveDodge);
  // Cálculo del chance to hit utilizando el modelo probabilístico no lineal
  const chanceToHit =
    (effectiveHitRate / (effectiveHitRate + effectiveDodge)) * 100; // Escalado a porcentaje

  // Generar un número aleatorio entre 0 y 100
  const randomValue = parseFloat((Math.random() * 100).toFixed(2));

  // El ataque es exitoso si el valor aleatorio es menor o igual a la probabilidad de acierto
  return randomValue <= chanceToHit;
}

export function calculateDmgReduction(
  armor: number,
  enemyLevel: number,
): number {
  const reduction = (armor / (85 * enemyLevel + armor + 400)) * 100;
  return parseFloat(Math.max(0, Math.min(reduction, 100)).toFixed(2));
}

export function calculateDmgMReduction(
  mArmor: number,
  enemyLevel: number,
): number {
  const reduction = (mArmor / (85 * enemyLevel + mArmor + 400)) * 100;
  return parseFloat(Math.max(0, Math.min(reduction, 100)).toFixed(2));
}
export function calculateTotalArmor(
  bodyParts: bodyParts,
  playerCon: number,
  playerLevel: number,
): number {
  const armorValue = Object.values(bodyParts).reduce((total, part) => {
    return total + (part?.armorValue || 0);
  }, 0);

  const totalArmor = (playerCon / 5) * playerLevel + armorValue;
  return parseFloat(totalArmor.toFixed(2));
}
export function calculateTotalMArmor(
  bodyParts: bodyParts,
  playerInt: number,
  playerLevel: number,
): number {
  const armorValue = Object.values(bodyParts).reduce((total, part) => {
    return total + (part?.mArmorValue || 0);
  }, 0);

  const totalArmor = (playerInt / 5) * playerLevel + armorValue;
  return parseFloat(totalArmor.toFixed(2));
}

export function calculateTotalDamage(
  bodyParts: bodyParts,
  playerStr: number,
  strBuff?: number,
): number {
  const damageValue = Object.values(bodyParts).reduce((total, part) => {
    return total + (part?.damage || 0);
  }, 0);
  const totalStr = strBuff ? playerStr + strBuff : playerStr;
  return totalStr + damageValue;
}

export function calculateTotalMaxDamage(
  bodyParts: bodyParts,
  playerStr: number,
  strBuff?: number,
): number {
  const damageValue = Object.values(bodyParts).reduce((total, part) => {
    return total + (part?.damageMax || 0);
  }, 0);
  const totalStr = strBuff ? playerStr + strBuff : playerStr;
  return totalStr + damageValue;
}

export function calculateMTotalDamage(
  bodyParts: bodyParts,
  playerInt: number,
  intBuff?: number,
): number {
  const damageValue = Object.values(bodyParts).reduce((total, part) => {
    return total + (part?.mDamage || 0);
  }, 0);
  const totalStr = intBuff ? playerInt + intBuff : playerInt;
  return totalStr + damageValue;
}

export function calculateMTotalMaxDamage(
  bodyParts: bodyParts,
  playerInt: number,
  intBuff?: number,
): number {
  const damageValue = Object.values(bodyParts).reduce((total, part) => {
    return total + (part?.mDamageMax || 0);
  }, 0);
  const totalStr = intBuff ? playerInt + intBuff : playerInt;
  return totalStr + damageValue;
}

export function calculateSummonDmgIncrease(playerCar: number): number {
  const summonDmg = parseFloat(((playerCar / 100) * 50).toFixed(2));
  return summonDmg;
}
