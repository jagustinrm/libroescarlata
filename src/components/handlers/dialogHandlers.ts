import { NavigateFunction } from 'react-router-dom';
import { getGlobalState } from '../../customHooks/useGlobalState';
import useDialogStore from '../../stores/dialogStore';

export const handleOptionSelect = (
  option: {
    outcome: string;
    enemies: string[];
    requiresItem: {name: string; cant: number; id: string; }[];
    days: number;
  },
  context: {
    navigate: NavigateFunction;
    travelCounter: number;
    setTravelCounter: (value: number) => void;
    handleContinue: () => void;
  },
) => {
  const {
    navigate,
    travelCounter,
    setTravelCounter,
    handleContinue,
  } = context;
  const {player, playerActions, removeItem, currentChapter } = getGlobalState();
  const {currentEvent} = useDialogStore.getState();
  if (option.outcome === 'fight') {
    navigate('/fightScene', {
      state: {
        enemy: option.enemies[0],
        fightType: 'story',
        event: currentEvent,
      },
    });
  } else if (option.outcome === 'deliver' && option.requiresItem) {
    option.requiresItem.forEach((item) => {
      for (let i = 0; i < item.cant; i++) {
        removeItem(player.inventoryId, 'others', item.id);
     
      }
    });
    playerActions.updateStoryProgress(currentChapter.storyId, {
      completedEvents: [currentEvent?.id],
    });
    handleContinue();
  } else if (option.outcome === 'travel') {
    if (travelCounter >= option.days) {
      playerActions.updateStoryProgress(currentChapter.storyId, {
        completedEvents: [currentEvent?.id],
      });
      handleContinue();
    } else {
      const newCounter = travelCounter + 1;
      setTravelCounter(newCounter);
      localStorage.setItem('travelCounter', newCounter.toString());

      if (Math.random() < 0.2) {
        navigate('/fightScene', {
          state: {
            enemy: option.enemies[0],
            fightType: 'travel',
            event: currentEvent,
          },
        });
      }
    }
  } else {
    handleContinue();
  }
};

export const handleContinue = (context: {
  currentLineIndex: number;
  setCurrentLineIndex: React.Dispatch<React.SetStateAction<number>>;
  isTextCompleted: boolean;
  setIsTextCompleted: (value: boolean) => void;
  setDisplayedText: (value: string) => void;
  onDialogEnd?: () => void;
}) => {
  const {currentDialog, currentLine} = useDialogStore.getState();
  const {
    currentLineIndex,
    setCurrentLineIndex,
    isTextCompleted,
    setIsTextCompleted,
    setDisplayedText,
    onDialogEnd,
  } = context;

  if (isTextCompleted) {
    if (currentDialog && currentLineIndex < currentDialog.lines.length - 1) {
      setCurrentLineIndex((prev: number) => prev + 1);
      setIsTextCompleted(false);
    } else if (onDialogEnd) {
      onDialogEnd();
    }
  } else {
    setDisplayedText(currentLine?.text || '');
    setIsTextCompleted(true);
  }
};

export const handleCompleteText = (
  setDisplayedText: (value: string) => void,
  setIsTextCompleted: (value: boolean) => void,
  intervalId: NodeJS.Timeout | null,
) => {
  const {currentLine} = useDialogStore.getState();
  intervalId && clearInterval(intervalId);
  setDisplayedText(currentLine?.text || '');
  setIsTextCompleted(true);
};
