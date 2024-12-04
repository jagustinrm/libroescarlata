import { SpellStore } from './types/spells';
import { create } from 'zustand';

const useSpellStore = create<SpellStore>((set) => ({
    spells: [],
    areSpellsLoaded: false,
    setSpells: (spells) =>
        set((state) => {
            // Solo actualiza si los hechizos no están vacíos
            if (state.spells.length === 0 && spells.length > 0) {
                return {
                    spells,
                    areSpellsLoaded: true,
                };
            }
            return state; // Si los hechizos ya están cargados, no se actualiza
        }),
    addNewSpell: (newSpell) =>
        set((state) => ({
            spells: [...state.spells, newSpell],
        })),
    updateSpell: (updatedSpell) =>
        set((state) => {
            const existingSpellIndex = state.spells.findIndex(
                (s) => s.name === updatedSpell.name
            );

            if (existingSpellIndex >= 0) {
                const updatedSpells = [...state.spells];
                updatedSpells[existingSpellIndex] = updatedSpell;
                return { spells: updatedSpells };
            }

            return { spells: [...state.spells, updatedSpell] };
        }),
}));

export default useSpellStore;
