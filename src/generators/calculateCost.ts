export const calculateCost = (equipLevel: number, rarity: string): number => {
  const rarityMultiplier: { [key: string]: number } = {
    Chatarra: 1,
    Común: 1.2,
    'Poco común': 1.5,
    Raro: 2,
    Épico: 3,
    Legendario: 5,
    Mítico: 8,
    Artefacto: 13,
    Corrupto: 21,
    Antiguo: 34,
    Prototipo: 55,
    Irónicas: 55,
  };
  return Math.floor(equipLevel * 10 * (rarityMultiplier[rarity] || 1));
};
