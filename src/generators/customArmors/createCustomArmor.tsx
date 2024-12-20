import { useState } from 'react';
import { Armor } from '../../stores/types/armor';
import { saveArmorToFirebase } from '../../firebase/saveArmorToFirebase';
import usePlayerStore from '../../stores/playerStore';
import { generateUniqueId } from './generateUniqueId'; // Asegúrate de importar la función correctamente
import { calculateCost } from './calculateCost';
import { generateRandomStatRequirements } from './generateRandomStatReq';
import { calculateArmorValue } from './calculateArmorValue';
import { generateBonusEffects } from './generateBonusEffects';

const generateRandomArmor = async (playerLevel: number): Promise<Armor> => {
  const rarities: Armor['rarity'][] = [
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
  const allMaterials = ['Metal', 'Madera', 'Cuero', 'Tela'];
  const prefixes = ['Feroz', 'Rápido', 'Leal'];
  const suffixes = ['Flama', 'Oso', 'Velocidad'];

  const effects = ['Revives al morir', 'Aura de fuego', 'Inmune a veneno'];
  const bodyParts = [
    'cabeza',
    'cara',
    'hombros',
    'pecho',
    'manos',
    'espalda',
    'cintura',
    'piernas',
  ];

  const randomBodyPart =
    bodyParts[Math.floor(Math.random() * bodyParts.length)];
  type BodyPart = (typeof bodyParts)[number];
  const bodyPartNames: Record<BodyPart, string[]> = {
    cabeza: ['yelmo', 'capucha', 'sombrero', 'casco'],
    cara: ['máscara', 'antifaz', 'barba postiza', 'gafas'],
    hombros: ['hombreras', 'chal'],
    pecho: ['coraza', 'chaleco', 'camisa', 'arnés'],
    manos: ['guantes', 'muñequera'],
    espalda: ['capa'],
    cintura: ['cinturón', 'faja', 'hebilla', 'riñonera'],
    piernas: ['pantalones', 'mallas'],
    pies: ['botas'],
  };

  const randomInitialName = () => {
    const namesForBodyPart = bodyPartNames[randomBodyPart];
    return namesForBodyPart[
      Math.floor(Math.random() * namesForBodyPart.length)
    ];
  };

  // Restringir materiales según la parte del cuerpo
  let allowedMaterials = allMaterials;
  if (randomBodyPart === 'espalda') {
    allowedMaterials = ['Tela'];
  } else if (randomBodyPart === 'cintura') {
    allowedMaterials = ['Tela', 'Cuero'];
  }

  const randomMaterial =
    allowedMaterials[Math.floor(Math.random() * allowedMaterials.length)];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  const uniqueId = await generateUniqueId();
  const equipLevel = Math.max(
    1,
    playerLevel - 5 + Math.floor(Math.random() * 11),
  );
  const cost = calculateCost(equipLevel, randomRarity);
  const armorValue = calculateArmorValue(
    randomMaterial,
    equipLevel,
    randomRarity,
  );
  const levelRequirement = Math.max(1, equipLevel - 2);
  const randomName = randomInitialName();
  // IMPORTAR  IMAGENES CON VITE
  const images = import.meta.glob('/src/assets/img/armors/**/*.png') as Record<
  string,
  () => Promise<{ default: string }>
>;
  
  type GetImageUrlParams = {
    randomPrefix?: string;
    randomBodyPart: string;
    randomName: string;
    randomMaterial?: string;
    randomSuffix?: string;
  };
  
  // type ImagesMap = {
  //   [key: string]: () => Promise<{ default: string }>;
  // };
  
  const getImageUrl = async (
    {
      randomPrefix,
      randomBodyPart,
      randomName,
      randomMaterial,
      randomSuffix,
    }: GetImageUrlParams
  ): Promise<string> => {
    const paths = [
      `/src/assets/img/armors/${randomBodyPart}/${randomPrefix}-${randomName}-${randomMaterial}-${randomSuffix}.png`,
      `/src/assets/img/armors/${randomBodyPart}/${randomName}-${randomMaterial}-${randomSuffix}.png`,
      `/src/assets/img/armors/${randomBodyPart}/${randomName}-${randomMaterial}.png`,
      `/src/assets/img/armors/${randomBodyPart}/${randomName}.png`,
    ].map((path) => path.toLowerCase());
  
    for (const path of paths) {
      if (images[path]) {
        try {
          const module = await images[path]();
          return module && module.default; // Retorna la URL del archivo encontrado
        } catch (error) {
          console.error(`Error cargando la imagen: ${path}`, error);
        }
      }
    }
  
    return 'https://via.placeholder.com/150'; // Si la imagen no existe
  };
  
  const imgUrl = await getImageUrl({
    randomPrefix,
    randomBodyPart,
    randomName,
    randomMaterial,
    randomSuffix,
  });

  return {
    id: uniqueId,
    name: `${randomPrefix} ${randomName} de ${randomMaterial} de ${randomSuffix}`,
    img: imgUrl,
    weight: Math.floor(Math.random() * 10) + 1,
    cost,
    description: 'Una armadura poderosa con efectos mágicos.',
    bodyPart: randomBodyPart,
    armorValue,
    equipLevel,
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
    sockets: Math.floor(Math.random() * 4),
    bonusEffects: generateBonusEffects(randomPrefix, randomSuffix),
    uniqueEffects: [randomEffect],
    setBonuses: {
      setName: 'Set Místico',
      bonuses: ['Bonificación de velocidad', 'Resistencia a fuego'],
    },
    scaling: {
      levelUpgrades: [1, 2, 3],
      newFeatures: ['Mejora de armadura'],
    },
    questReward: false,
    deletable: true,
  };
};

const CreateCustomArmor = () => {
  const [generatedArmor, setGeneratedArmor] = useState<Armor | null>(null);
  const player = usePlayerStore((state) => state.player);

  const createArmor = async () => {
    const newArmor = await generateRandomArmor(player.level);
    setGeneratedArmor(newArmor);
    try {
      await saveArmorToFirebase(newArmor.id, newArmor);
      console.log('Armadura guardada correctamente en Firebase.');
    } catch (error) {
      console.error('Error al guardar la armadura en Firebase:', error);
    }
  };

  return { generatedArmor, createArmor };
};

export default CreateCustomArmor;
