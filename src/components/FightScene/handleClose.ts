import { getGlobalState } from "../../customHooks/useGlobalState";

export const handleClose = (shouldClose: boolean, clearMessage: any, navigate: any) => {
    const {fightType} = getGlobalState();
    clearMessage()
    if (shouldClose) {
      if (event) {
        const key = fightType === 'travel' ? 'updateTravel' : 'updatedEvent';
        const data =
          fightType === 'travel' ? event : { ...event, status: 'completed' };

        localStorage.setItem(key, JSON.stringify(data));
      }
      navigate(-1);
    }
  };