import { useState, useEffect } from 'react';
import './PetStore.css';
import '../UI/designRpg.css';
import { usePetStore } from '../../stores/petsStore';
import { usePlayerStore } from '../../stores/playerStore';
import { Pet } from '../../stores/types/pets';
import BackButton from '../UI/BackButton';
import MessageBox from '../UI/MessageBox';

// Resto del código

export default function PetStore() {
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isContainerOpen, setIsContainerOpen] = useState(false); // Control de apertura del contenedor
  const { pets, setPets } = usePetStore();
  const { playerActions, player } = usePlayerStore();
  const [isBuyable, setIsBuyable] = useState(false);

  useEffect(() => {
    fetch('/mocks/pets.json')
      .then((response) => response.json())
      .then((data) => {
        setPets(data.pets);
      })
      .catch((error) => {
        console.error('Error al cargar los datos:', error);
      });
  }, []);

  const handleSelectPet = (creature: Pet) => {
    setSelectedPet(creature);
    setIsContainerOpen(true); // Abre el contenedor al seleccionar una mascota
    const findPet = player.petsName.some((p) => p === creature.name);
    if (creature.cost && !findPet) {
      setIsBuyable(true);
    } else {
      setIsBuyable(false);
    }
  };

  const handleSelectedPet = () => {
    if (selectedPet) {
      playerActions.setP_SelectedPet(selectedPet);

      setShowMessage(true);
      setMessageContent('¡Seleccionaste a ' + selectedPet.name + '!');
      setMessageType('success');
    }
  };

  const handleBuy = (petName: string, petCost: number) => {
    if (player.playerMaterial >= petCost) {
      playerActions.addPetsName(petName);
      playerActions.setPlayerMaterial(player.playerMaterial - petCost);
      setShowMessage(true);
      setMessageContent('¡Adoptaste a ' + petName + '!');
      setMessageType('success');
      setIsBuyable(false);
    } else {
      setShowMessage(true);
      setMessageContent('Te falta materiales');
      setMessageType('warning');
    }
  };

  return (
    <section className="petSection rpgui-container framed-golden-2">
      <div className="sectionPet">
        <div className="selectPet">
          <h3>Elegí una mascota</h3>
          <div className="listPets">
            <ul className="rpgui-list-imp">
              {pets ? (
                pets.map((creature) => (
                  <li
                    className="petList"
                    key={creature.name}
                    onClick={() => handleSelectPet(creature)}
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
        <div className="">
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
                    >
                      Seleccionar
                    </button>
                  )}
                </div>
                <div className="containerPetStats">
                  <h3 className="detailTitle">{selectedPet.name}</h3>
                  <p className="petText">
                    <strong>Tipo:</strong> {selectedPet.type}
                  </p>
                  <p className="petText">
                    <strong>Alineación:</strong> {selectedPet.alignment}
                  </p>
                  <p className="petText">
                    <strong>Puntos de vida:</strong> {selectedPet.hitPoints}
                  </p>
                  <p className="petText">
                    <strong>Clase de armadura:</strong> {selectedPet.armorClass}
                  </p>
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
        </div>
      </div>
      <BackButton />
      {showMessage && (
        <MessageBox
          message={messageContent}
          type={messageType as 'error' | 'warning' | 'success'}
          onClose={() => setShowMessage(false)}
        />
      )}
    </section>
  );
}
