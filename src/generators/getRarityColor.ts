export const getRarityColor = (rarity: string): string => {
  const rarityColors: { [key: string]: string } = {
    Chatarra: '#B0B0B0', // Gris claro brillante
    Común: '#F8F8F8', // Blanco puro con brillo
    'Poco común': '#32FF32', // Verde brillante
    Raro: '#1A8BFF', // Azul brillante
    Épico: '#B456FF', // Púrpura brillante
    Legendario: '#FFD700', // Oro vibrante
    Mítico: '#FF4D4D', // Rojo brillante
    Artefacto: '#FFA500', // Naranja brillante
    Corrupto: '#DC143C', // Carmesí brillante
    Antiguo: '#40E0D0', // Turquesa brillante
    Prototipo: '#C0C0C0', // Plateado brillante
    Irónicas: '#FFD1DC', // Rosa pastel claro brillante
  };

  return rarityColors[rarity] || 'white'; // Valor por defecto si no coincide
};
