import { bodyParts } from "../stores/types/others";

export function calculateTotalDodge(
  agi: number = 1, 
  dodge: number  
): number {
  // Constantes específicas del juego
  const DODGE_PER_AGILITY = 0.5; // Ejemplo: 1.2% por cada 100 puntos de agilidad

  // Cálculo del porcentaje de esquiva
  const dodgeFromAgility = agi * DODGE_PER_AGILITY;

  const totalDodge = dodge + dodgeFromAgility;
  // Asegurarse de que el porcentaje esté en un rango válido
  return totalDodge
}
export function calculateDodgePercentage(
    dodge: number    // Esquiva base del personaje
  ): number {
    return parseFloat(Math.max(0, Math.min(dodge, 100)).toFixed(2));
}
  
export function calculateHitRate(
  dex: number = 1,       // Destreza del atacante
  baseHitRate: number // Hit rate base del atacante
): number {
  // Constantes específicas del juego
  const HIT_RATE_PER_DEX = 1; // Ejemplo: Cada punto de dex aumenta 3% el hit rate

  // Calcular el porcentaje de hit rate
  const hitRateFromDex = dex * HIT_RATE_PER_DEX;
  const totalHitRate = baseHitRate + hitRateFromDex;
  console.log("hitrate", totalHitRate)
  // Asegurarse de que el porcentaje esté en un rango válido
  return parseFloat(Math.max(0, Math.min(totalHitRate, 100)).toFixed(2));
}
  
export function isAttackSuccessful(
    hitRatePercentage: number, // Porcentaje de hit rate del atacante
    dodgePercentage: number    // Porcentaje de esquiva del defensor
  ): boolean {
    // Asegurarse de que los porcentajes estén en un rango válido
    const effectiveHitRate = Math.max(0, Math.min(hitRatePercentage, 100));
    const effectiveDodge = Math.max(0, Math.min(dodgePercentage, 100));
    console.log(effectiveHitRate, effectiveDodge)
    // Cálculo del chance to hit utilizando el modelo probabilístico no lineal
    const chanceToHit =
      effectiveHitRate / (effectiveHitRate + effectiveDodge) * 100; // Escalado a porcentaje

  
    // Generar un número aleatorio entre 0 y 100
    const randomValue = parseFloat((Math.random() * 100).toFixed(2));

    // El ataque es exitoso si el valor aleatorio es menor o igual a la probabilidad de acierto
    return randomValue <= chanceToHit;
}
  
export function calculateDmgReduction(armor: number, enemyLevel: number): number {
    const reduction = (armor / ((85 * enemyLevel) + armor + 400)) * 100;
    return parseFloat(Math.max(0, Math.min(reduction, 100)).toFixed(2));
}
  
export function calculateTotalArmor(bodyParts: bodyParts, playerArmor: number): number {
    const armorValue = Object.values(bodyParts).reduce((total, part) => {
    return total + (part?.armorValue || 0);
    }, 0);
  
    return playerArmor + armorValue;
}
  
export function calculateTotalDamage(bodyParts: bodyParts, playerStr: number): number {
  const damageValue = Object.values(bodyParts).reduce((total, part) => {
    return total + (part?.damage || 0);
    }, 0);

  return playerStr + damageValue;
}
  
export function calculateTotalMaxDamage(bodyParts: bodyParts, playerStr: number): number {
  const damageValue = Object.values(bodyParts).reduce((total, part) => {
  return total + (part?.damageMax || 0);
  }, 0);

  return playerStr + damageValue;
}  

