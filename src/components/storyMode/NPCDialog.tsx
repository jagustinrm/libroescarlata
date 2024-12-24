import React, { useEffect, useState } from "react";
import useDialogStore from "../../stores/dialogStore";
import BackButton from "../UI/BackButton";
import { Dialog, DialogLine } from "../../stores/types/dialog";
import { useLocation, useNavigate } from "react-router-dom";
import useGlobalState from "../../customHooks/useGlobalState";

interface NPCDialogProps {
  dialogId: string; // ID del diálogo inicial
  onDialogEnd?: () => void; // Callback cuando el diálogo termina
  chapterIndex: number | undefined;
  storyIndex: number | undefined;
  storyId: string;
}

const NPCDialog: React.FC<NPCDialogProps> = ({
  dialogId,
  onDialogEnd,
  chapterIndex,
  storyIndex,
  storyId,
}) => {
  const { getDialogById, dialogs } = useDialogStore();
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentLine, setCurrentLine] = useState<DialogLine | null>(null);
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [currentEvent, setCurrentEvent] = useState<any | null>(null); // Estado para el evento
  const [displayedText, setDisplayedText] = useState(""); // Texto progresivo
  const [isTextCompleted, setIsTextCompleted] = useState(false); // Estado de finalización del texto
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // Estado para guardar el ID del intervalo
  const navigate = useNavigate();
  const { player, playerActions, stories } = useGlobalState();

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
      if (updatedEvent.status === "completed" && currentDialog) {
        playerActions.updateStoryProgress(storyId, {
          completedEvents: [updatedEvent.id],
        });

        const nextIndex =
          currentDialog.lines.findIndex(
            (line) => line.event === updatedEvent.id
          ) + 1;
        setCurrentLineIndex(nextIndex !== -1 ? nextIndex : currentLineIndex);
      }

      localStorage.removeItem("updatedEvent");
    }
  }, [currentDialog]);

  useEffect(() => {
    if (currentDialog) {
      setCurrentLine(currentDialog.lines[currentLineIndex]);
    }
  }, [currentLineIndex, currentDialog]);

  useEffect(() => {
    if (
      stories &&
      storyIndex !== undefined &&
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

  const handleOptionSelect = (option: { outcome: string; enemies: any[] }) => {
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

  const handleContinue = () => {
    if (isTextCompleted) {
      if (currentDialog && currentLineIndex < currentDialog.lines.length - 1) {
        setCurrentLineIndex((prev) => prev + 1);
        setIsTextCompleted(false);
      } else if (onDialogEnd) {
        onDialogEnd();
      }
    } else {
      // Elimina el texto progresivo y muestra el texto completo de inmediato
      setDisplayedText("");
      setTimeout(() => {
        setDisplayedText(currentLine?.text || "");
        setIsTextCompleted(true);
      }, 0); // Permite limpiar antes de actualizar
    }
  };
 
  useEffect(() => {
    if (currentLine?.text) {
      setDisplayedText("");
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

  // Maneja el clic para detener el intervalo si está en ejecución
  const handleDialogClick = () => {
    if (intervalId) {
      clearInterval(intervalId); // Detenemos el intervalo al hacer clic
      setIsTextCompleted(true); // Marcamos el texto como completado
    }
  };

  if (!currentLine || !currentDialog) {
    return <div className="npc-dialog">Cargando...</div>;
  }

  const verifyEvent = () => {
    // VERIFICA SI ESTÁ COMPLETO
    const actualStory = player.storyProgress.findIndex(
      (sp) => sp.storyId === storyId
    );
    if (player.storyProgress[actualStory]) {
      return (
        player.storyProgress[actualStory].completedEvents.findIndex(
          (ce) => ce === currentEvent
        ) !== -1
      );
    } else {
      return true;
    }
  };

  return (
    <div className="npc-dialog" onClick={handleDialogClick}>
      <div
        className="dialog-bar rpgui-cursor-point"
        onClick={!verifyEvent() ? handleContinue : undefined}
      >
        <p>{displayedText}</p>
      </div>

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
        currentLineIndex !== currentDialog.lines.length - 1 && (
          <img
            className="indicator-arrow-dialog rpgui-cursor-point"
            src="/img/UI/indicator-arrow.png"
            alt="Continuar"
            onClick={!currentEvent ? handleContinue : undefined}
          />
        )
      )}

      <BackButton />
    </div>
  );
};

export default NPCDialog;
