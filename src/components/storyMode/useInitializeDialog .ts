import { Dispatch, SetStateAction, useEffect } from 'react';
import useDialogStore from '../../stores/dialogStore';
import usePlayerStore from '../../stores/playerStore';
import useStoryStore from '../../stores/storyStore';
import { Dialog, DialogLine } from '../../stores/types/dialog';

interface UseInitializeDialogProps {
  dialogId: string | 0 | undefined;
  currentDialog: Dialog | null;
  currentLineIndex: number;
  storyIndex: number | undefined;
  chapterIndex: number | undefined;
  setCurrentDialog: (dialog: Dialog | null) => void;
  setCurrentLine: (line: DialogLine | null) => void;
  setCurrentLineIndex: (index: number) => void;
  setCurrentEvent: (event: any | null) => void;
  setTravelCounter: (count: number) => void;
  currentChapter: { currentDialogLine: number };
  storyId: string;
  currentLine: DialogLine | null;
  setDisplayedText: Dispatch<SetStateAction<string>>;
  setIsTextCompleted: Dispatch<SetStateAction<boolean>>;
  setIntervalId: Dispatch<SetStateAction<NodeJS.Timeout | null>>;
}
export const useInitializeDialog = ({
  dialogId,
  currentDialog,
  currentLineIndex,
  storyIndex,
  chapterIndex,
  setCurrentDialog,
  setCurrentLine,
  setCurrentLineIndex,
  setCurrentEvent,
  setTravelCounter,
  currentChapter,
  storyId,
  currentLine,
  setDisplayedText,
  setIsTextCompleted,
  setIntervalId,
}: UseInitializeDialogProps) => {
  const { getDialogById, dialogs } = useDialogStore.getState();
  const { playerActions } = usePlayerStore.getState();
  const { stories } = useStoryStore.getState();
  useEffect(() => {
    // 1️⃣ Inicializar el diálogo
    if (!dialogId) return;
    const dialog = getDialogById(dialogId);
    if (dialog) {
      setCurrentDialog(dialog);
      setCurrentLine(dialog.lines[currentChapter.currentDialogLine]); // Esto debería cambiarlo a la línea en la que estoy actualmente.
    } else {
      console.error(`Dialog with ID "${dialogId}" not found.`);
    }
  }, [dialogId, dialogs]);

  useEffect(() => {
    // 2️⃣ Actualizar el texto al regresar de eventos
    if (!currentDialog) return;

    const storedEvent = localStorage.getItem('updatedEvent');
    const storedTravel = localStorage.getItem('updateTravel');

    if (storedTravel) {
      const updateTravel = JSON.parse(storedTravel);
      const index = currentDialog.lines.findIndex(
        (line) => line.event === updateTravel.id,
      );
      setCurrentLineIndex(index !== -1 ? index : currentLineIndex);
      localStorage.removeItem('updateTravel');
    }

    if (storedEvent) {
      const updatedEvent = JSON.parse(storedEvent);
      setCurrentEvent(updatedEvent);

      if (updatedEvent.status === 'completed' && currentDialog) {
        playerActions.updateStoryProgress(storyId, {
          completedEvents: [updatedEvent.id],
        });

        const nextIndex =
          currentDialog.lines.findIndex(
            (line) => line.event === updatedEvent.id,
          ) + 1;
        setCurrentLineIndex(nextIndex !== -1 ? nextIndex : currentLineIndex);
      }

      localStorage.removeItem('updatedEvent');
    }
  }, [currentDialog]);

  useEffect(() => {
    // 3️⃣ Establecer la línea actual del diálogo a partir del índice
    if (currentDialog) {
      setCurrentLine(currentDialog.lines[currentLineIndex]);
    }
  }, [currentLineIndex, currentDialog]);

  useEffect(() => {
    // 4️⃣ Cargar contador de viajes desde localStorage
    const savedCounter = localStorage.getItem('travelCounter');
    setTravelCounter(savedCounter ? parseInt(savedCounter, 10) : 0);
  }, []);

  useEffect(() => {
    // 5️⃣ Cargar evento si hay uno en la línea actual
    if (
      storyIndex !== undefined &&
      stories[storyIndex]?.chapters !== undefined &&
      chapterIndex !== undefined &&
      currentLine
    ) {
      const chapter = stories[storyIndex]?.chapters[chapterIndex];
      if (chapter) {
        const event = chapter.events?.find((e) => e.id === currentLine.event);
        setCurrentEvent(event || null);
      } else {
        setCurrentEvent(null);
      }
    }
  }, [stories, storyIndex, chapterIndex, currentLine]);

  useEffect(() => {
    if (currentLine?.text) {
      setDisplayedText('');
      setIsTextCompleted(false);
      const text = currentLine.text;
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length - 1) {
          setDisplayedText((prev) => prev + text[index]);
          index++;
        } else {
          clearInterval(interval);
          setIsTextCompleted(true);
        }
      }, 30);

      // Guardamos el ID del intervalo para poder cancelarlo
      setIntervalId(interval);

      return () => clearInterval(interval);
    }
  }, [currentLine]);
};
