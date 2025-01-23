import { useState } from 'react';
import { Weapon, WeaponType } from '../../stores/types/weapons';
// import { saveItemToFirebase } from '../../firebase/saveItemToFirebase';
import usePlayerStore from '../../stores/playerStore';
import { generateUniqueId } from '../generateUniqueId';
import { calculateCost } from '../calculateCost';
import { generateRandomStatRequirements } from '../generateRandomStatReq';
import { generateBonusEffects } from '../generateBonusEffects';
import { calculateDamageValues } from './calculateDamageValue';
import { getRarityColor } from '../getRarityColor';
import assignRangeToItem from '../../utils/assignRangeToItem';

const generateRandomWeapon = async (playerLevel: number): Promise<Weapon> => {
  const rarities: Weapon['rarity'][] = [
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
  const weaponTypes: WeaponType[] = ['Espada', 'Hacha', 'Lanza', 'Arco', 'Daga', 'Bastón'];
  const materials = ['Hierro', 'Acero', 'Madera', 'Cristal'];
  const prefixes = ['Feroz', 'Ágil', 'Implacable'];
  const suffixes = ['del Dragón', 'de la Tormenta', 'de las Sombras'];
  const effects = ['Aumenta el daño crítico', 'Genera electricidad', 'Inmune al hielo'];
  
  const randomWeaponType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
  const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  const uniqueId = await generateUniqueId("weapons");
  const equipLevel = Math.max(1, playerLevel - 5 + Math.floor(Math.random() * 11));
  const cost = calculateCost(equipLevel, randomRarity);
  const {damage, damageMax} = calculateDamageValues(
    randomMaterial,
    equipLevel,
    randomRarity,
  );
  // IMPORTAR IMÁGENES CON VITE
  const images = import.meta.glob('/src/assets/img/weapons/**/*.png') as Record<
    string,
    () => Promise<{ default: string }>
  >;

  const getImageUrl = async (): Promise<string> => {
    const paths = [
      `/src/assets/img/weapons/${randomWeaponType}-${randomMaterial}-${randomRarity}.png`,
      `/src/assets/img/weapons/${randomWeaponType}-${randomMaterial}.png`,
      `/src/assets/img/weapons/${randomWeaponType}.png`,
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
  const color = getRarityColor(randomRarity);
  const imgUrl = await getImageUrl();

  return {
    id: uniqueId,
    name: `${randomPrefix} ${randomWeaponType} ${randomSuffix}`,
    img: imgUrl,
    weight: Math.floor(Math.random() * 10) + 1,
    cost,
    bodyPart: "manoDerecha",
    description: 'Una poderosa arma con efectos mágicos.',
    type: randomWeaponType,
    material: randomMaterial,
    rarity: randomRarity,
    damage,
    damageMax,
    range: assignRangeToItem(randomWeaponType),
    critical: "x2",
    color,
    equipLevel,
    levelRequirement: Math.max(1, equipLevel - 2),
    statRequirements: generateRandomStatRequirements(equipLevel),
    durability: { current: 100, max: 100, repairable: true },
    bonusEffects: generateBonusEffects(randomPrefix, randomSuffix),
    uniqueEffects: [randomEffect],
    sockets: Math.floor(Math.random() * 4),
    questReward: false,
    deleteable: true,
    playerOwner: false,
    soundEffect: "modificar",
    actions: {
        equippable: true
      } 
  };
};

// const CreateCustomWeapon = () => {
//   const [generatedWeapon, setGeneratedWeapon] = useState<Weapon | null>(null);
//   const player = usePlayerStore((state) => state.player);

//   const createWeapon = async () => {
//     const newWeapon = await generateRandomWeapon(player.level);
//     setGeneratedWeapon(newWeapon);
//     try {
//       // await saveItemToFirebase(player.name,newWeapon.id, newWeapon, "weapons");
//       console.log('Arma guardada correctamente en Firebase.');
//     } catch (error) {
//       console.error('Error al guardar el arma en Firebase:', error);
//     }
//   };

//   return { generatedWeapon, createWeapon };
// };

export const CreateCustomWeapons = () => {
  const [generatedWeapons, setGeneratedWeapons] = useState<Weapon[]>([]);
  const player = usePlayerStore((state) => state.player);

  const createWeapons = async (count: number) => {
    const weapons: Weapon[] = [];
    for (let i = 0; i < count; i++) {
      const newWeapon = await generateRandomWeapon(player.level);
      weapons.push(newWeapon);
    }
    setGeneratedWeapons(weapons);
    return weapons;
  };

  return { generatedWeapons, createWeapons };
};

// export default CreateCustomWeapon;
