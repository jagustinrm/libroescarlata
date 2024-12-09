export interface Spell {
    name: string;
    level: string;
    damage: string | null; // Algunas pueden no causar daño
    healingAmount?: string | null; // Opcional: Hechizos que curan (Ej: "1d8+1")
    healingDice?: string | null; // Opcional: Dados de curación escalables (Ej: "1d8/nivel")
    range: number; // Ej: "30 m"
    rangePlus?: string; // Opcional: Cómo escala el rango (Ej: "3 m/nivel")
    components: string[]; // Ej: ["V", "S", "M"]
    castingTime: string; // Ej: "1 acción estándar"
    duration: string; // Ej: "Instantánea"
    description: string;
    areaOfEffect?: string; // Opcional: Ej: "Radio de 6 m"
    targets?: string; // Opcional: Ej: "1 criatura"
    damageType?: string; // Opcional: Ej: "Fuego", "Fuerza"
    type: string; // Ej: "ofensivo", "defensivo", "utilidad"
    school: string; // Ej: "Evocación", "Conjuración"
    subtype?: string; // Opcional: Ej: "Fuerza", "Hielo"
    savingThrow?: string; // Opcional: Ej: "Reflejos para mitad"
    manaCost?: number; // Opcional: Coste de maná
    usesPerDay?: number; // Opcional: Máximo de usos diarios
    concentration: boolean; // Indica si requiere concentración
    ritual: boolean; // Si puede lanzarse como ritual
    materialCost?: { [key: string]: any }; // Ej: { objeto: "rubí", cantidad: 1 }
    scalingDamage?: string; // Opcional: Cómo escala el daño (Ej: "+1d6 cada 2 niveles")
    scalingRange?: string; // Opcional: Cómo escala el rango con el nivel
    maxLevelEffect?: number; // Opcional: Nivel máximo que afecta
    condition?: string; // Opcional: Condición adicional (Ej: "Prendido en llamas")
    conditionDuration?: string; // Opcional: Duración de la condición
    soundEffect?: string; // Opcional: Efecto de sonido (Ej: "Un rugido atronador")
    flavorText?: string; // Opcional: Texto narrativo adicional
    interactionWithOtherSpells?: string; // Opcional: Interacciones con otros hechizos
    spellResistance?: boolean; // Si es resistible por resistencia mágica
    criticalEffect?: string; // Opcional: Efecto crítico especial
    alignmentRestriction?: string[]; // Opcional: Restricciones de alineamiento
    counteredBy?: string[]; // Opcional: Hechizos que lo contrarrestan
    enhancedBy?: string[]; // Opcional: Hechizos que lo potencian
  }

interface SpellStore {
    spells: Spell[];
    areSpellsLoaded: boolean;
    setSpells: (spells: Spell[]) => void;
    addNewSpell: (newSpell: Spell) => void;
    updateSpell: (updatedSpell: Spell) => void;
}
