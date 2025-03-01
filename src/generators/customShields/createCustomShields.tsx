import { useState } from 'react';
import usePlayerStore from '../../stores/playerStore';
import { generateUniqueId } from '../generateUniqueId';
import { calculateCost } from '../calculateCost';
import { generateRandomStatRequirements } from '../generateRandomStatReq';
import { generateBonusEffects } from '../generateBonusEffects';
import { getRarityColor } from '../getRarityColor';
import { calculateArmorValue } from '../customArmors/calculateArmorValue.ts';
import { Armor } from '../../stores/types/armor.ts';

const generateRandomShield = async (playerLevel: number): Promise<Armor> => {
  const rarities: Armor['rarity'][] = [
    'Chatarra', 'Común', 'Poco común', 'Raro', 'Épico',
    'Legendario', 'Mítico', 'Artefacto', 'Corrupto', 'Antiguo', 'Prototipo', 'Irónicas'
  ];
  
  const materials = ['Madera', 'Hierro', 'Acero', 'Mithril', 'Ónice'];
  const prefixes = ['Resistente', 'Sagrado', 'Maldito', 'Ágil'];
  const suffixes = ['del Guardián', 'de la Fortaleza', 'del Caos'];
  const effects = ['Refleja daño', 'Aumenta la defensa', 'Resiste magia'];
  const shieldNames = ['Escudo', 'Paves'];

  const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  const randomShieldName = shieldNames[Math.floor(Math.random() * shieldNames.length)];
  const uniqueId = await generateUniqueId('shields');
  const equipLevel = Math.max(1, playerLevel - 5 + Math.floor(Math.random() * 11));
  const cost = calculateCost(equipLevel, randomRarity);
  const levelRequirement = Math.max(1, equipLevel - 2);
  const color = getRarityColor(randomRarity);

  const images = import.meta.glob('/src/assets/img/shields/**/*.png') as Record<string, () => Promise<{ default: string }>>;
    const armorValue = calculateArmorValue(
      randomMaterial,
      equipLevel,
      randomRarity,
    );

  const getImageUrl = async (): Promise<string> => {
    const paths = [
      `/src/assets/img/shields/${randomPrefix}-${randomShieldName}-${randomMaterial}-${randomSuffix}.png`,
      `/src/assets/img/shields/${randomShieldName}-${randomMaterial}-${randomSuffix}.png`,
      `/src/assets/img/shields/${randomShieldName}-${randomMaterial}.png`,
      `/src/assets/img/shields/${randomShieldName}.png`,
    ].map(path => path.toLowerCase());

    for (const path of paths) {
      if (images[path]) {
        try {
          const module = await images[path]();
          return module && module.default;
        } catch (error) {
          console.error(`Error cargando la imagen: ${path}`, error);
        }
      }
    }
    return 'https://via.placeholder.com/150';
  };

  const imgUrl = await getImageUrl();

  return {
    id: uniqueId,
    name: `${randomPrefix} ${randomShieldName} de ${randomMaterial} ${randomSuffix}`,
    img: imgUrl,
    weight: Math.floor(Math.random() * 10) + 5,
    cost,
    description: 'Un escudo formidable con propiedades mágicas.',
    armorValue,
    equipLevel,
    bodyPart: 'manoIzquierda',
    sockets: Math.floor(Math.random() * 4),
    color,
    rarity: randomRarity,
    prefixes: [randomPrefix],
    suffixes: [randomSuffix],
    material: randomMaterial,
    levelRequirement,
    statRequirements: generateRandomStatRequirements(equipLevel),
    durability: {
      current: 100,
      max: 100,
      repairable: true,
    },
    bonusEffects: generateBonusEffects(randomPrefix, randomSuffix),
    uniqueEffects: [randomEffect],
    deleteable: true,
    actions: {
      equippable: true,
      // blockable: true,
    },
  };
};

export const CreateCustomShields = () => {

  const [generatedShields, setGeneratedShields] = useState<Armor[]>([]);
  const player = usePlayerStore((state) => state.player);

  const createShields = async (count: number) => {
    const shields: Armor[] = [];
    for (let i = 0; i < count; i++) {
      const newShield = await generateRandomShield(player.level);
      shields.push(newShield);
    }
    setGeneratedShields(shields);
    return shields;
  };

  return { generatedShields, createShields };
};