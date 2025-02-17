
import { selectEnemy } from '../components/handlers/handleSelectEnemy.ts';
import { getGlobalState } from './useGlobalState.ts';

interface HandleNewEnemyClickParams {
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
}
export function useEnemyLoader(
  enemy: string
) {
  const handleNewEnemyClick = ({
    handleMessage,
  }: HandleNewEnemyClickParams) => {
    const {setTurn, resetPositions, player, setCreatureLoaded } = getGlobalState();
    handleMessage(`${player.name} busca un nuevo enemigo...`, 'success', false);
    setTimeout(() => {
      setTurn('player');
      setCreatureLoaded(true)
      selectEnemy(
        player.level,
        player.dungeonLevel,
        enemy);
      resetPositions();
    }, 1000);
  };

  return {  handleNewEnemyClick };
}
