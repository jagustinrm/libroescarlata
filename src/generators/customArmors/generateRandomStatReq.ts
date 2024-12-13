export const generateRandomStatRequirements = (equipLevel: number): { [stat: string]: number } => {
  const statRequirement = ["STR", "AGI", "WSD", "CHA", "CON", "DEX"] as const;
  const numberOfStats = Math.floor(Math.random() * statRequirement.length) + 1;
  const shuffledStats = [...statRequirement].sort(() => Math.random() - 0.5);
  const selectedStats = shuffledStats.slice(0, numberOfStats);

  const statRequirements: { [stat: string]: number } = {};
  selectedStats.forEach((stat) => {
    statRequirements[stat] = Math.max(5, equipLevel - 3 + Math.floor(Math.random() * 6));
  });

  return statRequirements;
};