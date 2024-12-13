import { useState } from "react";
import { Armor } from "../../stores/types/armor";
import { saveArmorToFirebase } from "../../firebase/saveArmorToFirebase";
import usePlayerStore from "../../stores/playerStore";
import { generateUniqueId } from "./generateUniqueId";// Asegúrate de importar la función correctamente
import { calculateCost } from "./calculateCost";
import { generateRandomStatRequirements } from "./generateRandomStatReq";
import { calculateArmorValue } from "./calculateArmorValue";
import { generateBonusEffects } from "./generateBonusEffects";


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

  const [generatedArmor, setGeneratedArmor] = useState<Armor | null>(null);
  const player = usePlayerStore((state) => state.player);
  
  const createArmor = async () => {

    const newArmor = await generateRandomArmor(player.level);
    setGeneratedArmor(newArmor);
    try {
      await saveArmorToFirebase(newArmor.id, newArmor);
      console.log("Armadura guardada correctamente en Firebase.");
    } catch (error) {
      console.error("Error al guardar la armadura en Firebase:", error);
    }
  };


  return { generatedArmor, createArmor };
};

export default CreateCustomArmor;
