export interface Class {
  className: string;
  hitDie: number;
  manaDie: number;
  dodgeDie: number;
  hitRateDie: number;
  armorClass: number;
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
  initialWeapon: string[];
}

interface ClassStore {
  classes: Class[];
  areClassesLoaded: boolean;
  setClasses: (classes: Class[]) => void;
  addNewClass: (newClass: Class) => void;
  updateClass: (updatedClass: Class) => void;
}
