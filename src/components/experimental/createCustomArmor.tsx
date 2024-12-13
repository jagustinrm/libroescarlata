import { useState } from "react";
import { Armor } from "../../stores/types/armor";
import { saveArmorToFirebase } from "./saveArmorToFirebase";
import { database } from "../../firebase/firebaseConfig";
import { ref, get } from "firebase/database";
// import usePlayerStore from "../../stores/playerStore";
const checkIfIdExists = async (id: string): Promise<boolean> => {
  try {
    const armorRef = ref(database, `armors/${id}`);
    const snapshot = await get(armorRef);
    return snapshot.exists();
  } catch (error) {
    console.error("Error al verificar si el ID existe en Firebase:", error);
    return false;
  }
};

const generateUniqueId = async (): Promise<string> => {
  let id = "";
  let idExists = true;
  do {
    id = Math.random().toString(36).substring(7);
    idExists = await checkIfIdExists(id);
  } while (idExists);
  return id;
};

const generateRandomStatRequirements = (equipLevel: number): { [stat: string]: number } => {
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

const calculateCost = (equipLevel: number, rarity: string): number => {
  const rarityMultiplier: { [key: string]: number } = {
    Chatarra: 1,
    Común: 1.2,
    "Poco común": 1.5,
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

const calculateArmorValue = (material: string, equipLevel: number, rarity: string): number => {
  const materialMultiplier: { [key: string]: number } = {
    Metal: 2,
    Madera: 1.2,
    Cuero: 1,
    Tela: 0.5,
  };
  const baseValue = equipLevel * (materialMultiplier[material] || 1);
  const rarityBonus = calculateCost(equipLevel, rarity) / 10;
  return Math.floor(baseValue + rarityBonus);
};

const generateBonusEffects = (prefixes: string, suffixes: string): [
  {
    category: string;
    type?: string;
    cant: number;
  }
] => {
  const prefixEffects: Record<string, { category: string; type?: string; min: number; max: number }> = {
    "Feroz": { category: "AttackBonus", type: "Physical", min: 5, max: 15 },
    "Rápido": { category: "Stats", type: "AGI", min: 3, max: 10 },
    "Leal": { category: "Resist", type: "Charm", min: 5, max: 12 },
  };

  const suffixEffects: Record<string, { category: string; type?: string; min: number; max: number }> = {
    "Flama": { category: "Resist", type: "Fire", min: 8, max: 20 },
    "Oso": { category: "Stats", type: "STR", min: 4, max: 10 },
    "Velocidad": { category: "Stats", type: "DEX", min: 3, max: 8 },
  };

  const randomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const effects: [
    {
      category: string;
      type?: string;
      cant: number;
    }
  ] = [{ category: "None", cant: 0 }];

  effects.pop() // Elimino el que ya está (None) porque Typescript me molesta 
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
const generateRandomArmor = async (playerLevel: number): Promise<Armor> => {
  const rarities: Armor["rarity"][] = [
    "Chatarra",
    "Común",
    "Poco común",
    "Raro",
    "Épico",
    "Legendario",
    "Mítico",
    "Artefacto",
    "Corrupto",
    "Antiguo",
    "Prototipo",
    "Irónicas",
  ];
  const allMaterials = ["Metal", "Madera", "Cuero", "Tela"];
  const prefixes = ["Feroz", "Rápido", "Leal"];
  const suffixes = ["Flama", "Oso", "Velocidad"];

  const effects = ["Revives al morir", "Aura de fuego", "Inmune a veneno"];
  const bodyParts = ["cabeza", "cara", "hombros", "pecho", "manos", "espalda", "cintura", "piernas"];

  const randomBodyPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
  type BodyPart = typeof bodyParts[number];
  const bodyPartNames: Record<BodyPart, string[]> = {
    cabeza: ["yelmo", "capucha", "sombrero", "gorra", "cascos"],
    cara: ["máscara", "antifaz", "barba postiza", "pintura facial", "gafas"],
    hombros: ["hombreras", "chal", "capa", "paño", "coraza"],
    pecho: ["coraza", "chaleco", "camisa", "blusa", "chaqueta"],
    manos: ["guantes", "puños", "manoplas", "muñequeras", "anillos"],
    espalda: ["capa", "arnés"],
    cintura: ["cinturón", "faja", "cangurera", "hebilla", "riñonera"],
    piernas: ["pantalones", "mallas", "polainas", "rodilleras", "botas"],
  };

  const randomInitialName = () => {
    const namesForBodyPart = bodyPartNames[randomBodyPart];
    return namesForBodyPart[Math.floor(Math.random() * namesForBodyPart.length)];
  };

  // Restringir materiales según la parte del cuerpo
  let allowedMaterials = allMaterials;
  if (randomBodyPart === "espalda") {
    allowedMaterials = ["Tela"];
  } else if (randomBodyPart === "cintura") {
    allowedMaterials = ["Tela", "Cuero"];
  }

  const randomMaterial = allowedMaterials[Math.floor(Math.random() * allowedMaterials.length)];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  const uniqueId = await generateUniqueId();

  const equipLevel = Math.max(1, playerLevel - 5 + Math.floor(Math.random() * 11));
  const cost = calculateCost(equipLevel, randomRarity);
  const armorValue = calculateArmorValue(randomMaterial, equipLevel, randomRarity);
  const levelRequirement = Math.max(1, equipLevel - 2);

  return {
    id: uniqueId,
    name: `${randomPrefix} ${randomInitialName()} de ${randomMaterial} de ${randomSuffix}`,
    img: "https://via.placeholder.com/150",
    weight: Math.floor(Math.random() * 10) + 1,
    cost,
    description: "Una armadura poderosa con efectos mágicos.",
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
      setName: "Set Místico",
      bonuses: ["Bonificación de velocidad", "Resistencia a fuego"],
    },
    scaling: {
      levelUpgrades: [1, 2, 3],
      newFeatures: ["Mejora de armadura"],
    },
    questReward: false,
  };
};


const CreateCustomArmor = () => {
  const [armor, setArmor] = useState<Armor | null>(null);
  // const player = usePlayerStore((state) => state.player);

  const createArmor = async () => {
    const newArmor = await generateRandomArmor(1);   // ACÁ IRÍA EL PLAYER LEVEL
    setArmor(newArmor);
    try {
      await saveArmorToFirebase(newArmor.id, newArmor);
      console.log("Armadura guardada correctamente en Firebase.");
    } catch (error) {
      console.error("Error al guardar la armadura en Firebase:", error);
    }
  };

  return (
    <div>
      <button onClick={createArmor}>Crear Armadura Aleatoria</button>
      {armor && (
        <div>
          <h3>{armor.name}</h3>
          <img src={armor.img} alt={armor.name} />
          <p>{armor.description}</p>
          <p>Parte: {armor.bodyPart} </p>
          <p>Efectos bonus: 
            <ul>
              {armor.bonusEffects?.map(e => 
                <li>
                  <p>Categoría: {e.category}  </p>
                  { e.type && <p>Tipo: {e.type} </p> }
                  <p>Cantidad: {e.cant}  </p>
                </li>
              )}
            </ul>
          </p>
          <p><strong>Valor de armadura:</strong> {armor.armorValue}</p>
          <p><strong>Rareza:</strong> {armor.rarity}</p>
          <p><strong>Material:</strong> {armor.material}</p>
          <p><strong>Peso:</strong> {armor.weight} kg</p>
          <p><strong>Costo:</strong> {armor.cost} monedas</p>
          <p><strong>Nivel de equipo:</strong> {armor.equipLevel}</p>
        </div>
      )}
    </div>
  );
};

export default CreateCustomArmor;
