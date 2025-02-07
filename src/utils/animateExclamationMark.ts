import { useEffect } from 'react';
import usePlayerStore from '../stores/playerStore';

export function useAnimateExclamationMark() {
  // Obtenemos leftPoints directamente desde el store usando un selector
  const leftPoints = usePlayerStore((state) => state.player.leftPoints);

  useEffect(() => {
    const exclamation = document.querySelector('.exclamationMark');
    if (!exclamation) return;

    if (leftPoints) {
      exclamation.classList.add('pulseAnimation');
    } else {
      exclamation.classList.remove('pulseAnimation');
    }
  }, [leftPoints]);
}
