import { NavigateFunction } from "react-router-dom";
import openMissions from "../../utils/openMissionsWindow";
import usePlayerStore from "../../stores/playerStore";

export const handleAction = (
  action: string,
  navigate: NavigateFunction,
  setShowMessage: (show: boolean) => void
) => {
  const { playerActions, player } = usePlayerStore.getState();
  switch (action) {
    case 'fight-normal':
      navigate('/fightScene', {
        state: {
          fightType: 'normal',
        },
      });
      break;
    case 'fight-dungeon':
      navigate('/fightScene', {
        state: {
          fightType: 'dungeon',
        },
      });
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
      playerActions.setP_LeftHealth(player.totalMaxHealth());
      playerActions.setP_LeftMana(player.totalMaxMana());
      setShowMessage(true);
      break;
    case 'missions':
      openMissions();
      break;
    default:
      console.warn(`Acción no reconocida: ${action}`);
  }
};
