export interface Class {
  className: string;
  hitDie: number;
  manaDie: string;
  armorClass: number;
  baseAttackBonus: number;
  saves: {
    fortitude: string;
    reflex: string;
    will: string;
  };
  expertice: number;
  dodge: number;
  classFeatures: string[];
  img: string;
  faceImg: string;
  iconImg: string;
  initialSpells: string[];
  description: string;
  initialArmor: string[];
  intiialWeapon: number[];
}

interface ClassStore {
  classes: Class[];
  areClassesLoaded: boolean;
  setClasses: (classes: Class[]) => void;
  addNewClass: (newClass: Class) => void;
  updateClass: (updatedClass: Class) => void;
}
