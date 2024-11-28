

export interface Class {
    className: string;
    hitDie: string;
    armorClass: string;
    baseAttackBonus: string;
    saves: {
        fortitude: string;
        reflex: string;
        will: string;
    };
    classFeatures: string[];
    
}

interface ClassStore {
    classes: Class[];
    areClassesLoaded: boolean;
    setClasses: (classes: Class[]) => void;
    addNewClass: (newClass: Class) => void;
    updateClass: (updatedClass: Class) => void;
}