import { create } from 'zustand';

interface Character {
  id: string; // Identificador único para cada personaje
  name: string; // Nombre del personaje
}

interface TurnStore {
  characters: Character[];
  currentTurnIndex: number;
  currentCharacter: Character | null;
  addCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;
  nextTurn: () => void;
  setTurn: (id: string) => void;
}

const useTurnStore = create<TurnStore>((set) => ({
  characters: [],
  currentTurnIndex: 0,
  currentCharacter: null,

  addCharacter: (character) =>
    set((state) => {
      const existingIndex = state.characters.findIndex(
        (char) => char.id === character.id,
      );

      if (existingIndex !== -1) {
        // Si el personaje ya existe, reemplázalo
        const updatedCharacters = [...state.characters];
        updatedCharacters[existingIndex] = character;

        return {
          characters: updatedCharacters,
          currentCharacter:
            state.currentTurnIndex === existingIndex
              ? character
              : state.currentCharacter,
        };
      } else {
        // Si el personaje no existe, añádelo
        return {
          characters: [...state.characters, character],
          currentCharacter:
            state.characters.length === 0 ? character : state.currentCharacter,
        };
      }
    }),

  removeCharacter: (id) =>
    set((state) => {
      const updatedCharacters = state.characters.filter(
        (char) => char.id !== id,
      );
      const currentTurnIndex =
        state.currentTurnIndex % updatedCharacters.length;
      return {
        characters: updatedCharacters,
        currentTurnIndex,
        currentCharacter: updatedCharacters[currentTurnIndex] || null,
      };
    }),

  nextTurn: () =>
    set((state) => {
      if (state.characters.length === 0) return state;
      const nextIndex = (state.currentTurnIndex + 1) % state.characters.length;
      return {
        currentTurnIndex: nextIndex,
        currentCharacter: state.characters[nextIndex],
      };
    }),
  setTurn: (id: string) =>
    set((state) => {
      const index = state.characters.findIndex((char) => char.id === id);
      if (index === -1) return state; // Si no se encuentra el personaje, no cambia nada
      return {
        currentTurnIndex: index,
        currentCharacter: state.characters[index],
      };
    }),
}));

export default useTurnStore;
