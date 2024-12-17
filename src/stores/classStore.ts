import { ClassStore } from './types/class';
import { create } from 'zustand';

const useClassStore = create<ClassStore>((set) => ({
  classes: [],
  areClassesLoaded: false,
  setClasses: (classes) =>
    set((state) => {
      // Solo actualiza si las clases no están vacías
      if (state.classes.length === 0 && classes.length > 0) {
        return {
          classes,
          areClassesLoaded: true,
        };
      }
      return state; // Si las clases ya están cargadas, no se actualiza
    }),
  addNewClass: (newClass) =>
    set((state) => ({
      classes: [...state.classes, newClass],
    })),
  updateClass: (updatedClass) =>
    set((state) => {
      const existingClassIndex = state.classes.findIndex(
        (c) => c.className === updatedClass.className,
      );

      if (existingClassIndex >= 0) {
        const updatedClasses = [...state.classes];
        updatedClasses[existingClassIndex] = updatedClass;
        return { classes: updatedClasses };
      }

      return { classes: [...state.classes, updatedClass] };
    }),
}));

export default useClassStore;
