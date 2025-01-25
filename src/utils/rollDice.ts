export function rollDice(dice: string | number): number {
  if (typeof dice === 'number') {
    return dice;
  }

  const regex = /(\d+)d(\d+)(?:\s*\+\s*(\d+))?/;
  const match = dice.match(regex);

  if (!match) {
    throw new Error('Invalid dice format');
  }

  const numDice = parseInt(match[1], 10); // Número de dados
  const dieSides = parseInt(match[2], 10); // Lados del dado
  const bonus = match[3] ? parseInt(match[3], 10) : 0; // Bonus adicional, si existe

  let total = 0;

  // Lanzar los dados
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * dieSides) + 1;
  }

  // Agregar el bonus
  total += bonus;

  return total;
}

export function modifyDice(diceNotation: string, modifier: number): string {
  // Expresión regular ajustada para manejar "d10" como "1d10"
  const regex = /^(?:(\d*)d(\d+))([+-]\d+)?$/;
  const match = diceNotation.match(regex);

  if (!match) {
    throw new Error('Notación de dado inválida');
  }

  // Extraer partes: cantidad (opcional), caras, y modificador opcional
  const [_, quantity, sides, mod] = match;
  const parsedQuantity = quantity ? parseInt(quantity) : 1; // Si no hay cantidad, asumir 1
  const parsedMod = mod ? parseInt(mod) : 0; // Si no hay modificador, asumir 0

  // Sumar el modificador adicional
  const newModifier = parsedMod + modifier;

  // Reconstruir la nueva notación
  return `${parsedQuantity}d${sides}${newModifier >= 0 ? `+${newModifier}` : newModifier}`;
}
