import { create } from 'zustand';
import { Dialog, DialogLine } from './types/dialog'; // Asegúrate de definir el tipo "Dialog" en otro archivo
import { CEvent } from './types/story';

const useDialogStore = create<{
  dialogs: Dialog[];
  userDialogProgress: { [userId: string]: { [dialogId: string]: boolean } };
  currentLine: DialogLine;
  currentDialog: Dialog;
  currentEvent: CEvent | null;
  setCurrentLine: (line: DialogLine) => void;
  setCurrentDialog: (dialog: Dialog) => void;
  setCurrentEvent: (cEvent: CEvent | null) => void; 
  loadDialogs: (dialogs: Dialog[]) => void;
  completeDialog: (userId: string, dialogId: string) => void;
  isDialogCompleted: (userId: string, dialogId: string) => boolean;
  getDialogById: (dialogId: string) => Dialog | undefined;
}>((set, get) => ({
  dialogs: [],
  userDialogProgress: {},
  currentLine: {text: '', event: ''},
  currentDialog: {id: '', lines: []},
  currentEvent: null,
  setCurrentLine: (line) => set({ currentLine: line }),
  setCurrentDialog: (dialog) => set({ currentDialog: dialog }),
  setCurrentEvent:  (cEvent) => set({ currentEvent: cEvent }),
  loadDialogs: (dialogs) =>
    set(() => {
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
    return dialogs.find((dialog) => dialog.id === dialogId); // Buscar por ID
  },
}));

export default useDialogStore;
