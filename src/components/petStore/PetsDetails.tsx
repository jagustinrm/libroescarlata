import { Pet } from "../../stores/types/pets";

interface PetDetailsProps {
  selectedPet: Pet | null;
  isContainerOpen: boolean;
  isBuyable: boolean;
  handleBuy: (petName: string, cost: number) => void;
  handleSelectedPet: () => void;
}

export default function PetDetails({ 
    selectedPet, 
    isContainerOpen, 
    isBuyable, 
    handleBuy, 
    handleSelectedPet 
}: PetDetailsProps) {
    if (!selectedPet) return null; 
    return (
    <div className={`containerPets ${isContainerOpen ? 'open' : ''}`}>
    {selectedPet && (
      <>
        <div className="imgPetandSelect">
          <img
            className="imgPet"
            src={selectedPet.img}
            alt={selectedPet.name}
          />
          {isBuyable ? (
            <div className="costSect">
              <button
                onClick={() =>
                  handleBuy(selectedPet.name, selectedPet.cost ?? 0)
                }
                className="rpgui-button adoptButton"
              >
                Adoptar
              </button>
              <p className="petCostText">
                {selectedPet.cost} materiales{' '}
              </p>
            </div>
          ) : (
            <button
              onClick={handleSelectedPet}
              className="rpgui-button"
            >Seleccionar</button>
          )}
        </div>
        <div className="containerPetStats">
          <h3 className="detailTitle">{selectedPet.name}</h3>
          <p className="petText">
            <strong>Tipo:</strong> {selectedPet.type}</p>
          <p className="petText">
            <strong>Alineación:</strong> {selectedPet.alignment}</p>
          <p className="petText">
            <strong>Puntos de vida:</strong> {selectedPet.hitPoints}</p>
          <p className="petText">
            <strong>Clase de armadura:</strong> {selectedPet.armorClass} </p>
          <p className="petText">
            <strong>Daño:</strong> {selectedPet.attacks[0].damage} - {selectedPet.attacks[0].damageMax} 
          </p>
          <p className="petText">
            <strong>Habilidades especiales:</strong>
          </p>
          <select className="specialAbilities rpgui-dropdown rpgui-dropdown-imp-header listSize">
            {selectedPet.specialAbilities.map((ability, index) => (
              <option
                className="optionsDropDown"
                key={index}
                value={ability}
              >
                {ability}
              </option>
            ))}
          </select>
        </div>
      </>
    )}
    </div>
    )
}