import { NavigateFunction } from 'react-router-dom';

export const handleOptionSelect = (
  option: {
    outcome: string;
    enemies: any[];
    requiresItem: any[];
    days: number;
  },
  context: {
    navigate: NavigateFunction;
    playerActions: any;
    removeItem: Function;
    player: any;
    storyId: string;
    currentEvent: any;
    travelCounter: number;
    setTravelCounter: (value: number) => void;
    handleContinue: () => void;
  },
) => {
  const {
    navigate,
    playerActions,
    removeItem,
    player,
    storyId,
    currentEvent,
    travelCounter,
    setTravelCounter,
    handleContinue,
  } = context;
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
    playerActions.updateStoryProgress(storyId, {
      completedEvents: [currentEvent.id],
    });
    handleContinue();
  } else if (option.outcome === 'travel') {
    if (travelCounter >= option.days) {
      playerActions.updateStoryProgress(storyId, {
        completedEvents: [currentEvent.id],
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
  currentDialog: any;
  currentLineIndex: number;
  setCurrentLineIndex: React.Dispatch<React.SetStateAction<number>>;
  isTextCompleted: boolean;
  setIsTextCompleted: (value: boolean) => void;
  currentLine: any;
  setDisplayedText: (value: string) => void;
  onDialogEnd?: () => void;
}) => {
  const {
    currentDialog,
    currentLineIndex,
    setCurrentLineIndex,
    isTextCompleted,
    setIsTextCompleted,
    currentLine,
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
  currentLine: any,
  setIsTextCompleted: (value: boolean) => void,
  intervalId: any,
) => {
  clearInterval(intervalId);
  setDisplayedText(currentLine?.text || '');
  setIsTextCompleted(true);
};
