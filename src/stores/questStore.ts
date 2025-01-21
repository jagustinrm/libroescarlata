import { QuestStore, Quest, QuestTree } from './types/quests';
import { create } from 'zustand';

const useQuestStore = create<QuestStore>((set) => ({
  questTree: {
    history: [],
    secondary: [],
    others: [],
  },
  areQuestsLoaded: false,

  // Reemplaza el QuestTree actual
  setQuestTree: (questTree: QuestTree) =>
    set((state) => {
      if (!state.areQuestsLoaded) {
        return {
          questTree,
          areQuestsLoaded: true,
        };
      }
      return state; // Si ya están cargadas, no se actualiza
    }),

  // Agrega una nueva misión a la categoría correspondiente
  addQuest: (newQuest: Quest, category) =>
    set((state) => {
      const updatedCategory = [...state.questTree[category], newQuest];
      return {
        questTree: {
          ...state.questTree,
          [category]: updatedCategory,
        },
      };
    }),

  // Actualiza una misión existente en una categoría específica
  updateQuest: (questName, updates, category) =>
    set((state) => {
      const updatedCategory = state.questTree[category].map((quest) =>
        quest.name === questName ? { ...quest, ...updates } : quest
      );
      return {
        questTree: {
          ...state.questTree,
          [category]: updatedCategory,
        },
      };
    }),
}));

export default useQuestStore;
