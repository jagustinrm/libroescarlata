export interface Spell {
    name: string;
    level: string;
    damage: string | null; // Algunas pueden no causar daño
    range: number; // Ej: "12 m/nivel"
    components: string[]; // Ej: ["V", "S", "M"]
    castingTime: string; // Ej: "1 acción estándar"
    duration: string; // Ej: "Instantánea"
    description: string;
    areaOfEffect?: string; // Opcional: Ej: "Radio de 6 m"
    targets?: string; // Opcional: Ej: "1 criatura"
    damageType?: string; // Opcional: Ej: "Fuego", "Fuerza"
}

interface SpellStore {
    spells: Spell[];
    areSpellsLoaded: boolean;
    setSpells: (spells: Spell[]) => void;
    addNewSpell: (newSpell: Spell) => void;
    updateSpell: (updatedSpell: Spell) => void;
}
