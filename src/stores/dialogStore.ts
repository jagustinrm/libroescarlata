import { create } from "zustand";
import { Dialog } from "./types/dialog"; // Asegúrate de definir el tipo "Dialog" en otro archivo

const useDialogStore = create<{
  dialogs: Dialog[];
  userDialogProgress: { [userId: string]: { [dialogId: string]: boolean } };
  loadDialogs: (dialogs: Dialog[]) => void;
  completeDialog: (userId: string, dialogId: string) => void;
  isDialogCompleted: (userId: string, dialogId: string) => boolean;
  getDialogById: (dialogId: string) => Dialog | undefined;
}>((set, get) => ({
  dialogs: [],
  userDialogProgress: {},

  loadDialogs: (dialogs) =>
  
    set(() => {
        console.log(dialogs)
      return { dialogs };
    }),

  completeDialog: (userId, dialogId) => {
    set((state) => {
      const newProgress = { ...state.userDialogProgress };
      if (!newProgress[userId]) {
        newProgress[userId] = {};
      }

      newProgress[userId][dialogId] = true;

      return { userDialogProgress: newProgress };
    });
  },

  isDialogCompleted: (userId, dialogId) => {
    const progress = get().userDialogProgress[userId];
    return progress ? progress[dialogId] === true : false;
  },

  getDialogById: (dialogId) => {
    const dialogs = get().dialogs;
    console.log( dialogId) 
    console.log(dialogs)
    return dialogs.find((dialog) => dialog.id === dialogId); // Buscar por ID
  },
}));

export default useDialogStore;
