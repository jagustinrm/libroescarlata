import React, { useEffect, useState } from "react";
import useDialogStore from "../../stores/dialogStore";
import BackButton from "../UI/BackButton";
import { Dialog, DialogLine } from "../../stores/types/dialog";
import { useLocation, useNavigate } from "react-router-dom";
import useGlobalState from "../../customHooks/useGlobalState";
interface NPCDialogProps {
  dialogId: string; // ID del diálogo inicial
  onDialogEnd?: () => void; // Callback cuando el diálogo termina
  chapterIndex: number | undefined
  storyIndex: number | undefined
}

const NPCDialog: React.FC<NPCDialogProps> = ({ dialogId, onDialogEnd, chapterIndex, storyIndex }) => {
  const { getDialogById, dialogs } = useDialogStore();
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentLine, setCurrentLine] = useState<DialogLine | null>(null);
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [currentEvent, setCurrentEvent] = useState<any | null>(null); // Estado para el evento
  const navigate = useNavigate();
  const { player, playerActions, stories } = useGlobalState();
  const location = useLocation();
  // Inicializar el diálogo al montar el componente o cambiar el dialogId
  useEffect(() => {
    const dialog = getDialogById(dialogId);
    if (dialog) {
      setCurrentDialog(dialog);
      setCurrentLine(dialog.lines[0]);
    } else {
      console.error(`Dialog with ID "${dialogId}" not found.`);
    }
  }, [dialogId, dialogs]);
 
  useEffect(() => {
    if (!currentDialog) return; 

    const storedEvent = localStorage.getItem("updatedEvent");

    if (storedEvent) {
      const updatedEvent = JSON.parse(storedEvent);
      setCurrentEvent(updatedEvent);
      console.log(updatedEvent) 
      console.log(currentDialog)
      if (updatedEvent.status === "completed" && currentDialog) {
        playerActions.updateStoryProgress("story-001", {completedEvents: ["event-1-1"]})

        // Saltar al siguiente diálogo después del evento
        console.log(updatedEvent.id)
        const nextIndex = currentDialog.lines.findIndex(
          (line) => line.event === updatedEvent.id
        ) + 1;
        console.log(nextIndex)
        setCurrentLineIndex(nextIndex !== -1 ? nextIndex : currentLineIndex);
      }

      // Limpiar el localStorage después de usar el evento
      localStorage.removeItem("updatedEvent");
    }
  }, [currentDialog]);

  // Actualizar la línea actual cuando el índice cambia
  useEffect(() => {
    if (currentDialog) {
      setCurrentLine(currentDialog.lines[currentLineIndex]);
    }
  }, [currentLineIndex, currentDialog]);

  // Actualizar el evento basado en la línea actual, storyIndex y chapterIndex
  useEffect(() => {
    if (stories && storyIndex !== undefined && chapterIndex !== undefined && currentLine) {
      const chapter = stories[storyIndex]?.chapters[chapterIndex];
      if (chapter) {
        const event = chapter.events?.find(e => e.id === currentLine.event);
        setCurrentEvent(event || null); // Actualizar el estado del evento
      } else {
        setCurrentEvent(null);
      }
    }
  }, [stories, storyIndex, chapterIndex, currentLine]);

  // Manejar la selección de una opción
  const handleOptionSelect = (option: { outcome: string; enemies: any[]; }) => {
    if (option.outcome === "fight") {
      navigate("/fightScene", {
        state: {
          enemy: option.enemies[0],
          fightType: "story",
          event: currentEvent, 
        },
      });
    }

    if (currentDialog && currentLineIndex < currentDialog.lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else if (onDialogEnd) {
      onDialogEnd();
    }
  };

  // Manejar el botón de continuar
  const handleContinue = () => {
    if (currentDialog && currentLineIndex < currentDialog.lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else if (onDialogEnd) {
      onDialogEnd();
    }
  };

  if (!currentLine || !currentDialog) {
    return <div className="npc-dialog">Cargando...</div>;
  }

  
 const verifyEvent = () => {
    const actualStory = player.storyProgress.findIndex(sp => sp.storyId === "story-001" )
    if (player.storyProgress[actualStory]) {
      return player.storyProgress[actualStory].completedEvents.findIndex(ce => ce === currentEvent) != -1
    } else {
      return true
    }
 }
  return (
    <div className="npc-dialog">
      <div className="dialog-bar rpgui-container framed-golden-2">
        <p>
          <strong>{currentLine.speaker}:</strong> {currentLine.text}
        </p>
      </div>

      {/* Renderizar opciones del evento si está disponible */}
      {currentEvent && verifyEvent() ? (
        <div className="dialog-options">
          {currentEvent.options.map((option: any) => (
            <button
              key={option.id}
              onClick={() => option.outcome && handleOptionSelect(option)}
              className="dialog-option"
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <button className="dialog-continue" onClick={handleContinue}>
          Continuar
        </button>
      )}

      <BackButton />
    </div>
  );
};

export default NPCDialog;
