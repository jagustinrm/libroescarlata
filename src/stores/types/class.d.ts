

export interface Class {
    className: string;
    hitDie: string;
    manaDie: string;
    armorClass: number;
    baseAttackBonus: number;
    saves: {
        fortitude: string;
        reflex: string;
        will: string;
    };
    classFeatures: string[];
    img: string;
    faceImg: string;
    initialSpells: string[];
    description: string;
    initialArmor: string[]
    intiialWeapon: number[]
}

interface ClassStore {
    classes: Class[];
    areClassesLoaded: boolean;
    setClasses: (classes: Class[]) => void;
    addNewClass: (newClass: Class) => void;
    updateClass: (updatedClass: Class) => void;
}