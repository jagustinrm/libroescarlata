import { useState } from 'react';
import BackButton from '../UI/BackButton';
import { Dialog, DialogLine } from '../../stores/types/dialog';
import { useNavigate } from 'react-router-dom';
import useGlobalState from '../../customHooks/useGlobalState';
import {
  handleOptionSelect,
  handleContinue,
  handleCompleteText,
} from '../handlers/dialogHandlers';
import ButtonEdited from '../UI/ButtonEdited';
import { useInitializeDialog } from './useInitializeDialog ';
import { CEvent } from '../../stores/types/story';

const NPCDialog = ({ onDialogEnd }: { onDialogEnd: () => void }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<DialogLine | null>(null);
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [currentEvent, setCurrentEvent] = useState<CEvent | null>(null); // Estado para el evento
  const [displayedText, setDisplayedText] = useState(''); // Texto progresivo
  const [isTextCompleted, setIsTextCompleted] = useState(false); // Estado de finalización del texto
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // Estado para guardar el ID del intervalo
  const navigate = useNavigate();
  const {
    player,
    playerActions,
    stories,
    inventories,
    removeItem,
    currentChapter,
  } = useGlobalState();
  const [travelCounter, setTravelCounter] = useState<number>(0);
  const storyIndex = stories.findIndex((s) => s.id === currentChapter.storyId);
  const chapterIndex = stories[storyIndex].chapters?.findIndex(
    (c) => c.id === currentChapter.chapterId,
  );
  const dialogId =
    typeof chapterIndex === 'number'
      ? stories[storyIndex]?.chapters?.[chapterIndex]?.dialogSequence
      : undefined;
  const storyId = currentChapter.storyId;

  useInitializeDialog({
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
  });

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
  // Completa el texto. Lo utilizo más que nada para los eventos.
  const handleComplete = () => {
    handleCompleteText(
      setDisplayedText,
      currentLine,
      setIsTextCompleted,
      intervalId,
    );
  };

  // Esto corta el diálogo. Limpia el intervalo para que no siga escribiendo.
  const handleDialogClick = () => {
    if (intervalId) {
      handleCompleteText(
        setDisplayedText,
        currentLine,
        setIsTextCompleted,
        intervalId,
      );
    }
  };
  if (!currentLine || !currentDialog) {
    return <div className="npc-dialog">Cargando...</div>;
  }
  const findItem = (id: string): number => {
    const inventory = inventories[player.inventoryId];
    if (!inventory || !inventory.others) return 0; // Manejo de casos en que no existe el inventario

    const countItems = inventory.others.filter((item) => item === id).length;
    return countItems;
  };
  const verifyEvent = () => {
    // Busca el índice del progreso en la historia actual
    const actualStoryIndex = player.storyProgress.findIndex(
      (sp) => sp.storyId === storyId,
    );

    if (actualStoryIndex === -1) {
      // Si no hay progreso en la historia, el evento se considera incompleto
      return false;
    }
    const actualStory = player.storyProgress[actualStoryIndex];
    const isEventCompleted = actualStory.completedEvents.includes(
      currentEvent?.id,
    );
    return isEventCompleted; // Retorna si el evento está completo
  };
  const speaker = currentLine?.speaker?.toLowerCase();
  const isSpeakerNarrator = speaker === 'narrador';
  const speakerImage = !isSpeakerNarrator ? `/img/NPC/${speaker}.png` : null;
  const isEventValid = !currentEvent || verifyEvent();
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
        onClick={isEventValid ? handleContinueWrapper : handleComplete}
      >
        <div className="dialog-bar speakerLine">
          <p className="speakerLine">{currentLine.speaker}</p>
        </div>
        <p>{displayedText}</p>
      </div>

      {currentEvent && !verifyEvent() ? (
        <div className="dialog-options">
          {currentEvent.options?.map((option) => (
            <div key={option.id}>
              {option.requiresItem?.map((i) => (
                <p key={i.id}>
                  {i.name}: {findItem(i.id)}/{i.cant}
                </p>
              ))}
              {option.outcome === 'travel' && (
                <p>
                  Días viajados: {travelCounter}/{option.days || '5'}
                </p>
              )}
            </div>
          ))}
          <div className="dialog-buttons">
            {currentEvent.options?.map((option) => (
              <ButtonEdited
                key={option.id}
                label={option.text}
                width="130px"
                height="33px"
                onClick={() =>
                  option.outcome && handleOptionSelectWrapper(option)
                }
                disabled={option.requiresItem?.some(
                  (i) => findItem(i.id) < i.cant,
                )}
              />
            ))}
          </div>
        </div>
      ) : (
        currentLineIndex !== currentDialog.lines.length - 1 && (
          <img
            className="indicator-arrow-dialog rpgui-cursor-point"
            src="/img/UI/indicator-arrow.png"
            alt="Continuar"
            onClick={isEventValid ? handleContinueWrapper : handleComplete}
          />
        )
      )}
      <BackButton />
    </div>
  );
};

export default NPCDialog;
