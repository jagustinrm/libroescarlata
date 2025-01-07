
  
export function calculateDodgePercentage(
    agi: number = 1, // Agilidad del personaje
    dodge: number    // Esquiva base del personaje
  ): number {
    // Constantes específicas del juego
    const DODGE_PER_AGILITY = 0.5; // Ejemplo: 1.2% por cada 100 puntos de agilidad
    console.log(agi)
    console.log(dodge)
    // Cálculo del porcentaje de esquiva
    const dodgeFromAgility = agi * DODGE_PER_AGILITY;
  
    const totalDodge = dodge + dodgeFromAgility;
  
    // Asegurarse de que el porcentaje esté en un rango válido
    return Math.max(0, Math.min(totalDodge, 100));
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
  
    // Asegurarse de que el porcentaje esté en un rango válido
    return Math.max(0, Math.min(totalHitRate, 100));
  }
  
  export function isAttackSuccessful(
    hitRatePercentage: number, // Porcentaje de hit rate del atacante
    dodgePercentage: number    // Porcentaje de esquiva del defensor
  ): boolean {
    // Asegurarse de que los porcentajes estén en un rango válido
    const effectiveHitRate = Math.max(0, Math.min(hitRatePercentage, 100));
    const effectiveDodge = Math.max(0, Math.min(dodgePercentage, 100));
  
    // Cálculo del chance to hit utilizando el modelo probabilístico no lineal
    const chanceToHit =
      effectiveHitRate / (effectiveHitRate + effectiveDodge) * 100; // Escalado a porcentaje
    console.log(chanceToHit, "chanceToHit");
  
    // Generar un número aleatorio entre 0 y 100
    const randomValue = Math.random() * 100;
  
    // El ataque es exitoso si el valor aleatorio es menor o igual a la probabilidad de acierto
    return randomValue <= chanceToHit;
  }
  
  
