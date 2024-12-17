export const generateBonusEffects = (
  prefixes: string,
  suffixes: string,
): [
  {
    category: string;
    type?: string;
    cant: number;
  },
] => {
  const prefixEffects: Record<
    string,
    { category: string; type?: string; min: number; max: number }
  > = {
    Feroz: { category: 'AttackBonus', type: 'Physical', min: 5, max: 15 },
    Rápido: { category: 'Stats', type: 'AGI', min: 3, max: 10 },
    Leal: { category: 'Resist', type: 'Charm', min: 5, max: 12 },
  };

  const suffixEffects: Record<
    string,
    { category: string; type?: string; min: number; max: number }
  > = {
    Flama: { category: 'Resist', type: 'Fire', min: 8, max: 20 },
    Oso: { category: 'Stats', type: 'STR', min: 4, max: 10 },
    Velocidad: { category: 'Stats', type: 'DEX', min: 3, max: 8 },
  };

  const randomValue = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const effects: [
    {
      category: string;
      type?: string;
      cant: number;
    },
  ] = [{ category: 'None', cant: 0 }];

  effects.pop(); // Elimino el que ya está (None) porque Typescript me molesta
  if (prefixEffects[prefixes]) {
    const { category, type, min, max } = prefixEffects[prefixes];
    effects.push({ category, type, cant: randomValue(min, max) });
  }

  if (suffixEffects[suffixes]) {
    const { category, type, min, max } = suffixEffects[suffixes];
    effects.push({ category, type, cant: randomValue(min, max) });
  }
  return effects;
};
