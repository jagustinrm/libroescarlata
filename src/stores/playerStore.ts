import { create } from 'zustand';
import { Player, PlayerStore } from './types/player';
import useInventoryStore from './inventoryStore';
import { StoryProgress } from './types/story';
import {
  calculateDmgMReduction,
  calculateDmgReduction,
  calculateDodgePercentage,
  calculateHitRatePercentage,
  calculateMTotalDamage,
  calculateMTotalMaxDamage,
  calculateSummonDmgIncrease,
  calculateTotalArmor,
  calculateTotalDamage,
  calculateTotalDodge,
  calculateTotalHitRate,
  calculateTotalMArmor,
  calculateTotalMaxDamage,
  calculateTotalMaxHealth,
  calculateTotalMaxMana,
  calculateTotalRes,
} from '../utils/calculateStats';
import { Item } from './types/items';
import { stats } from './entitiesData/stats';
import { elementStats } from './entitiesData/elementStats';
import { abilities } from './entitiesData/abilities';
import { bodyParts } from './entitiesData/bodyParts';

const initialPlayerState: Player = {
  name: '',
  playerId: '',
  level: 1,
  playerExp: 0,
  p_ExpToNextLevel: 1000,
  p_ExpPrevLevel: 0,
  c_MaxHealth: 1,
  controlResist: [{name: 'aturdir', value: 0}, {name: 'dormir', value: 0}, {name: 'paralizar', value: 0}],
  TotalControlRes: () => {
    const stateP = usePlayerStore.getState().player;
    return calculateTotalRes(stateP.controlResist, stateP.stats)
  },
  totalMaxHealth: () => {
    const state = usePlayerStore.getState().player;
    return calculateTotalMaxHealth(state.stats.con, state.stats.cha, state.c_MaxHealth) || 0;
  },
  c_LeftHealth: 1,
  c_MaxMana: 1,
  mdef: 1,
  totalMaxMana: () => {
    const state = usePlayerStore.getState().player;
    return calculateTotalMaxMana(state.stats.int,  state.stats.cha, state.c_MaxMana) || 0;
  },
  c_LeftMana: 1,
  classes: [],
  hitDie: 0,
  manaDie: 0,
  hitRateDie: 0,
  dodgeDie: 0,
  c_Conditions: [],
  dungeonLevel: 1,
  stats: stats,
  elementsStats: elementStats,
  statusEffects: [],
  buffs: {},
  leftPoints: 25,
  ...abilities,
  classFeatures: [],
  selectedPet: '',
  bodyParts: bodyParts,
  accessoriesParts: {
    anillo: {},
    aro: {},
    amuleto: null,
  },
  selectedSpell: null,
  playerMaterial: 0,
  petsName: [],
  enemiesDeleted: [],
  spells: [],
  inventoryId: '',
  classImg: '',
  avatarImg: '',
  hitRate: 50,
  dodge: 1,
  storyProgress: [], // Lista de progresos del jugador en las historias
  currentStoryId: null,
  totalDodge: () => {
    const state = usePlayerStore.getState().player;
    return calculateTotalDodge(state.stats.agi, state.dodge) || 0;
  },
  totalHitRate: () => {
    const state = usePlayerStore.getState().player;
    return calculateTotalHitRate(state.stats.dex, state.hitRate) || 0;
  },
  hitRatePercentage: () => {
    return calculateHitRatePercentage(
      usePlayerStore.getState().player.totalHitRate(),
      usePlayerStore.getState().player.level,
    );
  },
  dodgePercentage: () => {
    return calculateDodgePercentage(
      usePlayerStore.getState().player.totalDodge(),
    );
  },

  damage: () => {
    const state = usePlayerStore.getState().player;
    return (
      calculateTotalDamage(
        state.bodyParts,
        state.stats.str,
        state.buffs.str?.value,
      ) || 0
    );
  },
  damageMax: () => {
    const state = usePlayerStore.getState().player;
    return (
      calculateTotalMaxDamage(
        state.bodyParts,
        state.stats.str,
        state.buffs.str?.value,
      ) || 0
    );
  },
  mDamage: () => {
    const state = usePlayerStore.getState().player;
    return (
      calculateMTotalDamage(
        state.bodyParts,
        state.stats.int,
        state.buffs.int?.value,
      ) || 0
    );
  },
  mDamageMax: () => {
    const state = usePlayerStore.getState().player;
    return (
      calculateMTotalMaxDamage(
        state.bodyParts,
        state.stats.int,
        state.buffs.int?.value,
      ) || 0
    );
  },
  summonDmgIncrease: () => {
    const state = usePlayerStore.getState().player;
    return calculateSummonDmgIncrease(state.stats.cha) || 0;
  },

  totalArmorClass: () => {
    const state = usePlayerStore.getState().player;
    return (
      calculateTotalArmor(state.bodyParts, state.stats.con, state.level) || 0
    );
  },
  totalDmgReduction: (enemyLevel) => {
    const state = usePlayerStore.getState().player;
    return calculateDmgReduction(state.totalArmorClass(), enemyLevel);
  },
  totalMArmor: () => {
    const state = usePlayerStore.getState().player;
    return (
      calculateTotalMArmor(state.bodyParts, state.stats.int, state.level) || 0
    );
  },
  totalDmgMReduction: (enemyLevel) => {
    const state = usePlayerStore.getState().player;
    return calculateDmgMReduction(state.totalMArmor(), enemyLevel);
  },

  totalBlockValue: () => {
    return 0; // Valor predeterminado para bloqueo
  },
};

export const usePlayerStore = create<PlayerStore>((set) => ({
  player: initialPlayerState,

  // Agrupamos las acciones relacionadas con el jugador
  playerActions: {
    resetPlayer: () => set({ player: initialPlayerState }),
    setInventory: (inventory) =>
      set((state) => ({
        player: { ...state.player, inventoryId: inventory },
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
    addBuff: (buffName, value, duration) =>
      set((state) => ({
        player: {
          ...state.player,
          buffs: {
            ...state.player.buffs,
            [buffName]: {
              value: (state.player.buffs[buffName]?.value || 0) + value, // Incrementa el valor del buff si ya existe
              duration: Math.max(
                duration,
                state.player.buffs[buffName]?.duration || 0,
              ), // Actualiza la duración si es mayor
            },
          },
        },
      })),
    resetBuffs: () =>
      set((state) => ({
        player: {
          ...state.player,
          buffs: {}, // Reinicia todos los buffs
        },
      })),
    decrementBuffDurations: () =>
      set((state) => {
        const updatedBuffs = Object.fromEntries(
          Object.entries(state.player.buffs)
            .map(([buffName, buff]) => {
              if (
                typeof buff === 'object' &&
                buff !== null &&
                'duration' in buff
              ) {
                // TypeScript garantiza que buff es del tipo correcto aquí
                return [
                  buffName,
                  {
                    ...buff,
                    duration: buff.duration - 1,
                  },
                ];
              }
              return null; // Ignorar buffs que no cumplan con los requisitos
            })
            .filter(
              (entry): entry is [string, { duration: number; value: number }] =>
                entry !== null,
            ) // Filtra entradas inválidas
            .filter(([_, buff]) => buff.duration > -1), // Filtra buffs con duración <= 0
        );

        return {
          player: {
            ...state.player,
            buffs: updatedBuffs,
          },
        };
      }),
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
    setPlayerId: (id) => {
      console.log(id);
      set((state) => ({
        player: { ...state.player, playerId: id }, // Asegúrate de usar un nombre de propiedad consistente
      }));
    },

    setPlayerLevel: (level) =>
      set((state) => ({
        player: { ...state.player, level },
      })),
    setc_MaxHealth: (c_MaxHealth) =>
      set((state) => ({
        player: { ...state.player, c_MaxHealth },
      })),
    setc_LeftHealth: (c_LeftHealth) =>
      set((state) => ({
        player: { ...state.player, c_LeftHealth },
      })),
    setc_MaxMana: (c_MaxMana) =>
      set((state) => ({
        player: { ...state.player, c_MaxMana },
      })),

    setc_LeftMana: (c_LeftMana) =>
      set((state) => ({
        player: { ...state.player, c_LeftMana },
      })),
      setDungeonLevel: (dungeonLevel) =>
        set((state) => ({
          player: { ...state.player, dungeonLevel },
        })),
    // setArmorClass: (armorClass) =>
    //   set((state) => ({
    //     player: { ...state.player, armorClass },
    //   })),
    setClassImg: (classImg) =>
      set((state) => ({
        player: { ...state.player, classImg },
      })),
    setAvatarImg: (avatarImg) =>
      set((state) => ({
        player: { ...state.player, avatarImg },
      })),
    setDodge: (dodge) =>
      set((state) => ({
        player: { ...state.player, dodge },
      })),
    setHitRate: (hitRate) =>
      set((state) => ({
        player: { ...state.player, hitRate },
      })),
    setDodgeDie: (dodgeDie) =>
      set((state) => ({
        player: { ...state.player, dodgeDie },
      })),
    setHitRateDie: (hitRateDie) =>
      set((state) => ({
        player: { ...state.player, hitRateDie },
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
    setBodyParts: (newBodyParts) =>
      set((state) => ({
        player: {
          ...state.player,
          bodyParts: { ...state.player.bodyParts, ...newBodyParts },
        },
      })),
      setP_SelectedBodyPart: (selectedBodyPart) =>
        set((state) => {
          const { bodyPart, twoHanded } = selectedBodyPart;
          // SI el tipo que me quiero equipar es a dos manos, saca lo que tenga de la mano izq.
          // Si el tipo es de manoIzq y en la mano derecha ya tiene un arma de dos manos, se la saca.
          return {
            player: {
              ...state.player,
              bodyParts: {
                ...state.player.bodyParts,
                [bodyPart]: selectedBodyPart,
                ...(twoHanded === true && { manoIzquierda: null }),
                ...(bodyPart === "manoIzquierda" && state.player.bodyParts.manoDerecha.twoHanded === true && {manoDerecha: null})
              },
            },
          };
        }),

    addP_SelectedAccesories: (selectedAccesory, index = null) => {
      const { type, id } = selectedAccesory; // Asegúrate de que `id` esté disponible en el accesorio
      const lowerCaseType = type.toLowerCase();

      set((state) => {
        const { accessoriesParts } = state.player;

        // Máximos permitidos por tipo
        const maxAccessories: { [key: string]: number } = {
          anillo: 10,
          aro: 2,
          amuleto: 1,
        };

        // Accesorios actuales del tipo
        const currentAccessories = accessoriesParts[lowerCaseType] || {};

        // Verificar si el accesorio ya está equipado
        const isAlreadyEquipped = Object.values(currentAccessories).some(
          (accessory: Item) => accessory.id === id,
        );

        if (isAlreadyEquipped) {
          console.log(`El accesorio con id ${id} ya está equipado.`);
          return state; // No se realizan cambios
        }

        // Si es un amuleto, tratarlo como un objeto único
        if (lowerCaseType === 'amuleto') {
          return {
            player: {
              ...state.player,
              accessoriesParts: {
                ...accessoriesParts,
                [lowerCaseType]: selectedAccesory,
              },
            },
          };
        }

        // Manejo de anillos y aros con índices obligatorios
        if (index !== null) {
          if (
            index < 0 || // Índice mínimo válido
            index > maxAccessories[lowerCaseType] // Índice máximo permitido
          ) {
            console.error(`Índice fuera de rango para ${type}: ${index}.`);
            return state; // No se realizan cambios
          }

          // Reemplaza o agrega el accesorio en el índice proporcionado
          return {
            player: {
              ...state.player,
              accessoriesParts: {
                ...accessoriesParts,
                [lowerCaseType]: {
                  ...currentAccessories,
                  [index]: selectedAccesory,
                },
              },
            },
          };
        }

        // Si no se proporciona índice, muestra un error porque es obligatorio en esta estructura
        console.error(`Es necesario proporcionar un índice para ${type}.`);
        return state; // No se realizan cambios
      });
    },

    setP_SelectedAccessories: (newAccessoriesParts) => {
      set((state) => {
        return {
          player: {
            ...state.player,
            accessoriesParts: newAccessoriesParts, // Reemplaza completamente el objeto
          },
        };
      });
    },

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
          hitDie: hitDie, // Agrega el nuevo valor al hitDie
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
        const existingStory = state.player.storyProgress.find(
          (story) => story.storyId === storyId,
        );
        console.log(existingStory, 'historia existente')
        let updatedProgress;
        if (existingStory) {
          // Si el storyId existe, actualiza el progreso
          updatedProgress = state.player.storyProgress.map((story) => {
            if (story.storyId === storyId) {
              return {
                ...story,
                completedEvents: [
                  ...(story.completedEvents || []), // Mantenemos los eventos existentes
                  ...(progress.completedEvents || []), // Agregamos los nuevos eventos
                ],
              };
            }
            return story;
          });
        } else {
          // Si el storyId no existe, agrega el nuevo progreso
          updatedProgress = [
            ...state.player.storyProgress,
            { storyId, completedEvents: progress.completedEvents || [] },
          ];
        }

        return { player: { ...state.player, storyProgress: updatedProgress } };
      }),

    setCurrentStoryId: (storyId: string | null) =>
      set((state) => ({
        player: { ...state.player, currentStoryId: storyId },
      })),
      setC_Conditions: (newConditions) => {
        set((state) => ({
          player: {
            ...state.player,
            c_Conditions: newConditions, 
          },
        }))
      },
      updateC_Conditions: (newCondition) => { 
        set((state) => ({
            player: {
              ...state.player,
              c_Conditions: [...state.player.c_Conditions, newCondition], // Agrega la nueva condición al array
            },
          }))
        },
    setPlayer: (newPlayer: Partial<Player>) =>
      set((state) => ({
        player: {
          ...state.player, // Conservamos las propiedades actuales
          ...newPlayer, // Sobrescribimos con las nuevas propiedades del objeto player proporcionado
        },
      })),
  },

  // Mantén la función de inventario separada
  getInventoryFunctions: () => useInventoryStore.getState(),
}));

export default usePlayerStore;
