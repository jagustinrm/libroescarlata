import { NavigateFunction } from 'react-router-dom';
import openMissions from '../../utils/openMissionsWindow';
import usePlayerStore from '../../stores/playerStore';
import { getGlobalState } from '../../customHooks/useGlobalState';
import { calculateTotalMaxHealth, calculateTotalMaxMana } from '../../utils/calculateStats';

export const handleAction = (
  action: string,
  navigate: NavigateFunction,
  setShowMessage: (show: boolean) => void,
) => {
  const { playerActions, player } = usePlayerStore.getState();
  const { setFightType } = getGlobalState();
  switch (action) {
    case 'fight-normal':
      setFightType('normal');
      navigate('/fightScene');

      break;
    case 'fight-dungeon':
      setFightType('dungeon');
      navigate('/fightScene');
      break;
    case 'townMap':
      navigate('/townMap');
      break;
    case 'itemShop':
      navigate('/itemShop');
      break;
    case 'armory':
      navigate('/armory');
      break;
    case 'petStore':
      navigate('/petStore');
      break;
    case 'bestiary':
      navigate('/bestiary');
      break;
    case 'inventory':
      navigate('/inventory');
      break;
    case 'recoverHealth':
      playerActions.setc_LeftHealth(calculateTotalMaxHealth(player.stats.con, player.stats.cha, player.c_MaxHealth));
      playerActions.setc_LeftMana(calculateTotalMaxMana(player.stats.int, player.stats.cha, player.c_MaxMana));
      setShowMessage(true);
      break;
    case 'missions':
      openMissions();
      break;
    default:
      console.warn(`Acción no reconocida: ${action}`);
  }
};
