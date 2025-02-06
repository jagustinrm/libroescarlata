import useGlobalState from "../../customHooks/useGlobalState"
import { Pet } from "../../stores/types/pets";
import { handleSelectPet } from "./handleSelectPet";

interface PetsListProps {
    setSelectedPet: (pet: Pet) => void;
    setIsContainerOpen: (open: boolean) => void;
    setIsBuyable: (buyable: boolean) => void;
  }

export default function PetsList ({setSelectedPet, setIsContainerOpen, setIsBuyable}: PetsListProps) {
    const {pets} = useGlobalState();
    const onPetSelect = (creature: Pet) => {
        handleSelectPet(creature, setSelectedPet, setIsContainerOpen, setIsBuyable);
    };
  
    return (
    <div className="selectPet">
          <h3>Elegí una mascota</h3>
          <div className="listPets">
            <ul className="rpgui-list-imp">
              {pets ? (
                pets.map((creature) => (
                  <li
                    className="petList"
                    key={creature.name}
                    onClick={() => onPetSelect(creature)}
                  >
                    {creature.name}
                  </li>
                ))
              ) : (
                <p>Cargando mascotas...</p>
              )}
            </ul>
          </div>
        </div>
        )
}