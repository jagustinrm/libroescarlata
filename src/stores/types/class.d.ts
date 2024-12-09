

export interface Class {
    className: string;
    hitDie: string;
    armorClass: number;
    baseAttackBonus: number;
    saves: {
        fortitude: string;
        reflex: string;
        will: string;
    };
    classFeatures: string[];
    img: string;
    initialSpells: string[];
}

interface ClassStore {
    classes: Class[];
    areClassesLoaded: boolean;
    setClasses: (classes: Class[]) => void;
    addNewClass: (newClass: Class) => void;
    updateClass: (updatedClass: Class) => void;
}