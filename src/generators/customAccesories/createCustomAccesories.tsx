import { useState } from 'react';
import { Accessory } from '../../stores/types/accesories';
import { saveItemToFirebase } from '../../firebase/saveItemToFirebase';
import usePlayerStore from '../../stores/playerStore';
import { generateUniqueId } from '../generateUniqueId';
import { calculateCost } from '../calculateCost';
import { generateRandomStatRequirements } from '../generateRandomStatReq';
import { generateBonusEffects } from '../generateBonusEffects';
import { getRarityColor } from '../getRarityColor';

const generateRandomAccessory = async (playerLevel: number): Promise<Accessory> => {
  const rarities: Accessory['rarity'][] = [
    'Chatarra',
    'Común',
    'Poco común',
    'Raro',
    'Épico',
    'Legendario',
    'Mítico',
    'Artefacto',
    'Corrupto',
    'Antiguo',
    'Prototipo',
    'Irónicas',
  ];
  const accessoryTypes = ['Amuleto', 'Anillo', 'Aro'];
  const materials = ['Hierro', 'Acero', 'Oro', 'Cristal'];
  const prefixes = ['Brillante', 'Místico', 'Resistente'];
  const suffixes = ['de la Luz', 'de la Sombra', 'del Trueno'];
  const effects = ['Aumenta la resistencia al fuego', 'Incrementa la agilidad', 'Regenera maná lentamente'];

  const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
  const randomAccessoryType = accessoryTypes[Math.floor(Math.random() * accessoryTypes.length)];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  const uniqueId = await generateUniqueId("accessories");
  const equipLevel = Math.max(1, playerLevel - 5 + Math.floor(Math.random() * 11));
  const cost = calculateCost(equipLevel, randomRarity);

  const color = getRarityColor(randomRarity);


  const images = import.meta.glob('/src/assets/img/accessories/**/*.png') as Record<
  string,
  () => Promise<{ default: string }>
>;
  const getImageUrl = async (): Promise<string> => {
    const paths = [
      `/src/assets/img/accessories/${randomAccessoryType}-${randomMaterial}-${randomRarity}.png`,
      `/src/assets/img/accessories/${randomAccessoryType}-${randomMaterial}.png`,
      `/src/assets/img/accessories/${randomAccessoryType}.png`,
    ].map((path) => path.toLowerCase());

    for (const path of paths) {
      if (images[path]) {
        try {
          const module = await images[path]();
          return module.default;
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
    name: `${randomPrefix} ${randomAccessoryType} ${randomSuffix}`,
    img: imgUrl,
    weight: Math.floor(Math.random() * 5) + 1,
    cost,
    description: 'Un accesorio mágico con propiedades únicas.',
    type: randomAccessoryType,
    bodypart: randomAccessoryType === 'Amuleto' ? 'Cuello' : 'Dedo',
    rarity: randomRarity,
    prefixes: [randomPrefix],
    suffixes: [randomSuffix],
    bonusEffects: generateBonusEffects(randomPrefix, randomSuffix),
    uniqueEffects: [randomEffect],
    levelRequirement: Math.max(1, equipLevel - 2),
    statRequirements: generateRandomStatRequirements(equipLevel),
    durability: { current: 100, max: 100, repairable: true },
    questReward: false,
    deleteable: true,
    color,
    playerOwner: false,
    actions: {
        equippable: true
      }
  };
};

const CreateCustomAccessory = () => {
  const [generatedAccessory, setGeneratedAccessory] = useState<Accessory | null>(null);
  const player = usePlayerStore((state) => state.player);

  const createAccessory = async () => {
    const newAccessory = await generateRandomAccessory(player.level);
    setGeneratedAccessory(newAccessory);
    try {
      await saveItemToFirebase(player.name, newAccessory.id, newAccessory, "accessories");
      console.log('Accesorio guardado correctamente en Firebase.');
    } catch (error) {
      console.error('Error al guardar el accesorio en Firebase:', error);
    }
  };

  return { generatedAccessory, createAccessory };
};

export const CreateCustomAccessories = () => {
  const [generatedAccessories, setGeneratedAccessories] = useState<Accessory[]>([]);
  const player = usePlayerStore((state) => state.player);

  const createAccessories = async (count: number) => {
    const accessories: Accessory[] = [];
    for (let i = 0; i < count; i++) {
      const newAccessory = await generateRandomAccessory(player.level);
      accessories.push(newAccessory);
    }
    setGeneratedAccessories(accessories);
    return accessories;
  };

  return { generatedAccessories, createAccessories };
};

export default CreateCustomAccessory;
