import React, { useEffect, useState } from "react";
import useDialogStore from "../../stores/dialogStore";
import BackButton from "../UI/BackButton";
import { Dialog, DialogLine } from "../../stores/types/dialog";
import { useLocation, useNavigate } from "react-router-dom";
import useGlobalState from "../../customHooks/useGlobalState";
import { handleOptionSelect, handleContinue  } from "../handlers/dialogHandlers";
import ButtonEdited from "../UI/ButtonEdited";
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
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<DialogLine | null>(null);
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [currentEvent, setCurrentEvent] = useState<any | null>(null); // Estado para el evento
  const [displayedText, setDisplayedText] = useState(""); // Texto progresivo
  const [isTextCompleted, setIsTextCompleted] = useState(false); // Estado de finalización del texto
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // Estado para guardar el ID del intervalo
  const navigate = useNavigate();
  const { player, playerActions, stories, inventories, removeItem } = useGlobalState();
  const [travelCounter, setTravelCounter] = useState<number>(0);

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
    const storedTravel = localStorage.getItem("updateTravel");
    if (storedTravel) {

      const updateTravel = JSON.parse(storedTravel);
      const index =
      currentDialog.lines.findIndex(
        (line) => line.event === updateTravel.id
      )
      setCurrentLineIndex(index !== -1 ? index : currentLineIndex);
      localStorage.removeItem("updateTravel");
    }

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
    // Cargar contador de viajes desde localStorage
    const savedCounter = localStorage.getItem("travelCounter");
    setTravelCounter(savedCounter ? parseInt(savedCounter, 10) : 0);
  }, []);

  useEffect(() => {
    if (
      stories &&
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

  const handleOptionSelectWrapper = (option: any) => {
    handleOptionSelect(option, {
      navigate,
      playerActions,
      removeItem,
      player,
      storyId,
      currentEvent,
      travelCounter,
      setTravelCounter,
      handleContinue: handleContinueWrapper,
    });
  };

  const handleContinueWrapper = () => {
    handleContinue({
      currentDialog,
      currentLineIndex,
      setCurrentLineIndex,
      isTextCompleted,
      setIsTextCompleted,
      currentLine,
      setDisplayedText,
      onDialogEnd,
    });
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
  const findItem = (id: string): number => {
    const inventory = inventories[player.inventoryId];
    if (!inventory || !inventory.others) return 0; // Manejo de casos en que no existe el inventario
  
    const countItems = inventory.others.filter(item => item === id).length;
    return countItems;
  };
  const verifyEvent = () => {
    // Busca el índice del progreso en la historia actual
    const actualStoryIndex = player.storyProgress.findIndex(
      (sp) => sp.storyId === storyId
    );
  
    if (actualStoryIndex === -1) {
      // Si no hay progreso en la historia, el evento se considera incompleto
      return false;
    }
    const actualStory = player.storyProgress[actualStoryIndex];
    const isEventCompleted = actualStory.completedEvents.includes(currentEvent.id);
  
    // Retorna si el evento está completo
    return isEventCompleted;
  };
  const speaker = currentLine?.speaker?.toLowerCase();
  const isSpeakerNarrator = speaker === "narrador";
  const speakerImage = !isSpeakerNarrator
    ? `/img/NPC/${speaker}.png`
    : null;

    return (
      <div className="npc-dialog" onClick={handleDialogClick}>
              {!isSpeakerNarrator && speakerImage && (
          <img
            src={speakerImage}
            alt={currentLine?.speaker}
            className="npc-speaker-image"
          />
        )}
        <div
          className="dialog-bar rpgui-cursor-point"
          onClick={!currentEvent || verifyEvent() ? handleContinueWrapper : undefined}
        >
          <div className="dialog-bar speakerLine">
            <p className="speakerLine">{currentLine.speaker}</p>
          </div>
          <p>{displayedText}</p>
        </div>
  
        {currentEvent && !verifyEvent() ? (
          <div className="dialog-options">
            {currentEvent.options.map((option: any) => (
      
              <div key={option.id}>
                {option.requiresItem &&
                  option.requiresItem.map((i) => (
                    <p key={i.id}>
                      {i.name}: {findItem(i.id)}/{i.cant}
                    </p>
                  ))}
                {option.outcome === "travel" && (
                  <p>
                    Días viajados: {travelCounter}/{option.days || "5"}
                  </p>
                )}
                {/* <button
                  onClick={() => option.outcome && handleOptionSelectWrapper(option)}
                  className="dialog-option"
                  disabled={
                    option.requiresItem?.some(
                      (i: any) => findItem(i.id) < i.cant
                    ) 
                  }
                >
                  {option.text}
                </button> */}
                

              </div>
   
            ))}
            <div style={{display: 'flex', flexDirection: 'row', marginBottom: '5px', justifyContent: 'center'}}>
              {currentEvent.options.map((option: any) => (
                  <div style={{ marginTop: '5px'}}>
                  <ButtonEdited
                    label= {option.text}
                    width="130px"
                    height="33px"
                    onClick={() => option.outcome && handleOptionSelectWrapper(option)}
                    disabled={
                      option.requiresItem?.some(
                        (i: any) => findItem(i.id) < i.cant
                      ) 
                    }
                  />
                  </div>
                ))}
            </div>
          </div>
        ) : (
          currentLineIndex !== currentDialog.lines.length - 1 && (
            <img
              className="indicator-arrow-dialog rpgui-cursor-point"
              src="/img/UI/indicator-arrow.png"
              alt="Continuar"
              onClick={!currentEvent || currentEvent && verifyEvent()  ? handleContinueWrapper : undefined}
              />
          )
        )}
  
        <BackButton />
      </div>
    );
  };
  
  export default NPCDialog;