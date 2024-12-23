import { create } from 'zustand';
import { PlayerStore } from './types/player';
import useInventoryStore from './inventoryStore';
import { StoryProgress } from './types/story';

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  player: {
    name: '',
    level: 1,
    playerExp: 0,
    p_ExpToNextLevel: 1000,
    p_ExpPrevLevel: 0,
    p_MaxHealth: 1,
    p_LeftHealth: 1,
    p_MaxMana: 1,
    p_LeftMana: 1,
    classes: [],
    hitDie: '',
    manaDie: '',
    armorClass: 0,
    baseAttackBonus: 0,
    saves: {
      fortitude: '',
      reflex: '',
      will: '',
    },
    stats: {
      str: 0,
      dex: 0,
      con: 0,
      int: 0,
      wis: 0,
      cha: 0,
    },
    statsIncrease: {
      str: 0,
      dex: 0,
      con: 0,
      int: 0,
      wis: 0,
      cha: 0,
    },
    leftPoints: 0,
    classFeatures: [],
    selectedPet: '',
    selectedWeapon: null,
    selectedArmor: null,
    selectedSpell: null,
    playerMaterial: 0,
    petsName: [],
    enemiesDeleted: [],
    spells: [],
    inventoryId: '',
    classImg: '',
    avatarImg: '',
    totalArmorClass: () => {
      const state = get().player; // Obtén el estado actual
      const armorValue = state.selectedArmor?.armorValue || 0; // Usa 0 si selectedArmor es null
      return state.armorClass + armorValue;
    },
    storyProgress: [], // Lista de progresos del jugador en las historias
    currentStoryId: null, // ID de la historia en la que está actualmente
  },

  // Agrupamos las acciones relacionadas con el jugador
  playerActions: {
    setInventory: (inventory) =>
      set((state) => ({
        player: { ...state.player, inventoryId: inventory },
      })),
    setSaves: (saves) =>
      set((state) => ({
        player: {
          ...state.player,
          saves,
        },
      })),
    addStatsPoints: (points, type) =>
      set((state) => ({
        player: {
          ...state.player,
          stats: {
            ...state.player.stats,
            [type]: state.player.stats[type] + points,
          },
        },
      })),
    setStatsIncrease: (newstatsIncrease) =>
      set((state) => ({
        player: { ...state.player, statsIncrease: { ...newstatsIncrease } },
      })),
    addStatsIncrease: (points, type) =>
      set((state) => ({
        player: {
          ...state.player,
          statsIncrease: {
            ...state.player.statsIncrease,
            [type]: state.player.statsIncrease[type] + points,
          },
        },
      })),
    addStatsLeftPoints: (leftPoints) =>
      set((state) => ({
        player: {
          ...state.player,
          leftPoints: state.player.leftPoints + leftPoints,
        },
      })),
    setStatsLeftPoints: (leftPoints) =>
      set((state) => ({
        player: {
          ...state.player,
          leftPoints: leftPoints,
        },
      })),
    updateSaves: (saves) =>
      set((state) => ({
        player: {
          ...state.player,
          saves: {
            ...state.player.saves,
            ...saves,
          },
        },
      })),
    setStats: (newStats) =>
      set((state) => ({
        player: { ...state.player, stats: { ...newStats } },
      })),

    setPlayerMaterial: (playerMaterial) =>
      set((state) => ({
        player: { ...state.player, playerMaterial },
      })),
    setPlayerExp: (playerExp) =>
      set((state) => ({
        player: { ...state.player, playerExp },
      })),
    setP_ExpToNextLevel: (p_ExpToNextLevel) =>
      set((state) => ({
        player: { ...state.player, p_ExpToNextLevel },
      })),
    setP_ExpPrevLevel: (p_ExpPrevLevel) =>
      set((state) => ({
        player: { ...state.player, p_ExpPrevLevel },
      })),
    setPlayerName: (name) =>
      set((state) => ({
        player: { ...state.player, name },
      })),
    setPlayerLevel: (level) =>
      set((state) => ({
        player: { ...state.player, level },
      })),
    setP_MaxHealth: (p_MaxHealth) =>
      set((state) => ({
        player: { ...state.player, p_MaxHealth },
      })),
    setP_LeftHealth: (p_LeftHealth) =>
      set((state) => ({
        player: { ...state.player, p_LeftHealth },
      })),
    setP_MaxMana: (p_MaxMana) =>
      set((state) => ({
        player: { ...state.player, p_MaxMana },
      })),
    setP_LeftMana: (p_LeftMana) =>
      set((state) => ({
        player: { ...state.player, p_LeftMana },
      })),
    setArmorClass: (armorClass) =>
      set((state) => ({
        player: { ...state.player, armorClass },
      })),
    setClassImg: (classImg) =>
      set((state) => ({
        player: { ...state.player, classImg },
      })),
    setAvatarImg: (avatarImg) =>
      set((state) => ({
        player: { ...state.player, avatarImg },
      })),
    setBaseAttackBonus: (baseAttackBonus) =>
      set((state) => ({
        player: { ...state.player, baseAttackBonus },
      })),
    addClassFeature: (feature) =>
      set((state) => ({
        player: {
          ...state.player,
          classFeatures: [...state.player.classFeatures, feature],
        },
      })),
    setClassFeature: (features) => {
      set((state) => ({
        player: {
          ...state.player,
          classFeatures: [...features], // Reinicia el array con los nuevos valores
        },
      }));
    },
    addClasses: (newClass) =>
      set((state) => {
        if (!state.player.classes.includes(newClass)) {
          return {
            player: {
              ...state.player,
              classes: [...state.player.classes, newClass],
            },
          };
        }
        return state;
      }),
    addSpell: (spell) =>
      set((state) => {
        // Verificar si el hechizo ya existe en el array
        if (!state.player.spells.some((s) => s === spell)) {
          return {
            ...state,
            player: {
              ...state.player,
              spells: [...state.player.spells, spell], // Inmutabilidad al añadir
            },
          };
        }
        return state; // Si ya existe, devolver el estado sin cambios
      }),
    setSpell: (spells) =>
      set((state) => ({
        ...state,
        player: {
          ...state.player,
          spells, // Reemplazar directamente el array de hechizos
        },
      })),

    addPetsName: (newPet) =>
      set((state) => {
        if (!state.player.petsName.includes(newPet)) {
          return {
            player: {
              ...state.player,
              petsName: [...state.player.petsName, newPet],
            },
          };
        }
        return state;
      }),
    setPlayerClass: (classes) =>
      set((state) => ({
        player: { ...state.player, classes: [classes] },
      })),
    setP_SelectedPet: (selectedPet) =>
      set((state) => ({
        player: { ...state.player, selectedPet },
      })),
    setP_SelectedWeapon: (selectedWeapon) =>
      set((state) => ({
        player: { ...state.player, selectedWeapon },
      })),
    setP_SelectedArmor: (selectedArmor) =>
      set((state) => ({
        player: { ...state.player, selectedArmor },
      })),
    setP_SelectedSpell: (selectedSpell) =>
        set((state) => ({
          player: { ...state.player, selectedSpell },
      })),  
    setHitDie: (hitDie) =>
      set((state) => ({
        player: {
          ...state.player,
          hitDie: hitDie, // Establece un nuevo valor para hitDie
        },
      })),
    setManaDie: (manaDie) =>
      set((state) => ({
        player: {
          ...state.player,
          manaDie: manaDie, // Establece un nuevo valor para hitDie
        },
      })),
    updateHitDie: (hitDie) =>
      set((state) => ({
        player: {
          ...state.player,
          hitDie: `${state.player.hitDie}, ${hitDie}`, // Agrega el nuevo valor al hitDie
        },
      })),
    setEnemiesDeleted: (enemiesDeleted) =>
      set((state) => ({
        player: { ...state.player, enemiesDeleted: enemiesDeleted },
      })),
      setStoryProgress: (progress: StoryProgress[]) =>
        set((state) => ({
          player: { ...state.player, storyProgress: progress },
        })),
        updateStoryProgress: (storyId: string, progress: Partial<StoryProgress>) =>
          set((state) => {
            console.log(storyId);
            console.log(progress);
        
            const existingStory = state.player.storyProgress.find((story) => story.storyId === storyId);
        
            let updatedProgress;
            if (existingStory) {
              // Si el storyId existe, actualiza el progreso
              updatedProgress = state.player.storyProgress.map((story) =>
                story.storyId === storyId ? { ...story, ...progress } : story
              );
            } else {
              // Si el storyId no existe, agrega el nuevo progreso
              updatedProgress = [...state.player.storyProgress, { storyId, ...progress }];
            }
        
            return { player: { ...state.player, storyProgress: updatedProgress } };
          }),
        
      setCurrentStoryId: (storyId: string | null) =>
        set((state) => ({
          player: { ...state.player, currentStoryId: storyId },
        })),
  },

  // Mantén la función de inventario separada
  getInventoryFunctions: () => useInventoryStore.getState(),
}));

export default usePlayerStore;
