import { useState } from 'react';
import BackButton from '../UI/BackButton';
import { useNavigate } from 'react-router-dom';
import useGlobalState, { getGlobalState } from '../../customHooks/useGlobalState';
import {
  handleOptionSelect,
  handleContinue,
  handleCompleteText,
} from '../handlers/dialogHandlers';
import ButtonEdited from '../UI/ButtonEdited';
import { useInitializeDialog } from './useInitializeDialog ';
import useDialogStore from '../../stores/dialogStore';

const NPCDialog = ({ onDialogEnd }: { onDialogEnd: () => void }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const {currentLine, currentDialog, currentEvent} = useDialogStore();
  const [displayedText, setDisplayedText] = useState(''); // Texto progresivo
  const [isTextCompleted, setIsTextCompleted] = useState(false); // Estado de finalización del texto
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // Estado para guardar el ID del intervalo
  const navigate = useNavigate();
  const {
    player,
    stories,
    inventories,
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
    currentLineIndex,
    storyIndex,
    chapterIndex,
    setCurrentLineIndex,
    setTravelCounter,
    currentChapter,
    storyId,
    setDisplayedText,
    setIsTextCompleted,
    setIntervalId,
  });

  const handleOptionSelectWrapper = (option: any) => {
    handleOptionSelect(option, {
      navigate,
      travelCounter,
      setTravelCounter,
      handleContinue: handleContinueWrapper,
    });
  };

  const handleContinueWrapper = () => {
    handleContinue({
      currentLineIndex,
      setCurrentLineIndex,
      isTextCompleted,
      setIsTextCompleted,
      setDisplayedText,
      onDialogEnd,
    });
  };
  // Completa el texto. Lo utilizo más que nada para los eventos.
  const handleComplete = () => {
    handleCompleteText(
      setDisplayedText,
      setIsTextCompleted,
      intervalId,
    );
  };

  // Esto corta el diálogo. Limpia el intervalo para que no siga escribiendo.
  const handleDialogClick = () => {
    if (intervalId) {
      handleCompleteText(
        setDisplayedText,
        setIsTextCompleted,
        intervalId,
      );
    }
  };
  if (!currentLine || !currentDialog) {
    return <div className="npc-dialog">Cargando...</div>;
  }
  const findItem = (name: string): number => {
    const inventory = inventories[player.inventoryId];
    const {otherItems} = getGlobalState();
    if (!inventory || !inventory.others) return 0; 
    const itemNames = inventory.others.map(i => 
      otherItems.find(o => o.id === i)?.name
    ).filter(name => name !== undefined); // Filtra los `undefined` en caso de que no haya coincidencia
    
   
    const countItems = itemNames.filter((item) => item === name).length;
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
                  {i.name}: {findItem(i.name)}/{i.cant}
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
                  (i) => findItem(i.name) < i.cant,
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
