import usePlayerStore from "../../stores/playerStore";
import { Pet } from "../../stores/types/pets";

export const handleSelectPet = (
    creature: Pet,
    setSelectedPet: (pet: Pet) => void,
    setIsContainerOpen: (open: boolean) => void,
    setIsBuyable: (buyable: boolean) => void,
  ) => {
    const {player} = usePlayerStore.getState();

    setSelectedPet(creature);
    setIsContainerOpen(true);
    const findPet = player.petsName.some((p) => p === creature.name);
    setIsBuyable(!!creature.cost && !findPet);
  };