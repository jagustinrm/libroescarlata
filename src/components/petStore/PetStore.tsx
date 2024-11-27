import { useState, useEffect } from 'react';
import './PetStore.css';
import '../designRpg.css'
import { usePetStore } from '../../stores/petsStore';
import { usePlayerStore } from '../../stores/playerStore';
import { Pet } from '../../stores/types/pets';
import BackButton from '../UI/BackButton';
import MessageBox from '../UI/MessageBox';

export default function PetStore() {
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState('')
  const [messageType, setMessageType] = useState('')
  const handleClose = () => {
    setShowMessage(false);
  };
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null); // Guardamos el objeto completo
  const { pets, setPets } = usePetStore();
  const { playerActions, player } = usePlayerStore();
  const [isBuyable, setIsBuyable] = useState(false)

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

  // Función para manejar la selección de una mascota (sin actualizar el jugador aún)
  const handleSelectPet = (creature: Pet) => {
    setSelectedPet(creature); // Guarda la mascota seleccionada
    const findPet = player.petsName.some(p => p === creature.name)
    console.log(player.petsName)
    if (creature.cost && !findPet) {
      setIsBuyable(true)
    } else {
      setIsBuyable(false)
    }
  };

  // Función para manejar la confirmación de la mascota seleccionada
  const handleSelectedPet = () => {
    if (selectedPet) {
      playerActions.setP_SelectedPet(selectedPet); // Guarda el selectedPet en el store de player
      alert('Seleccionaste: ' + selectedPet.name); // Muestra el nombre de la mascota seleccionada
    }
  };

  const handleBuy = (petName: string, petCost: number) => {
    if (player.playerMaterial >= petCost) {
        playerActions.addPetsName(petName);
        playerActions.setPlayerMaterial(player.playerMaterial - petCost)
        setShowMessage(true)
        setMessageContent("¡Adoptaste a " + petName + '!')
        setMessageType('success')
    } else {
        alert("Te falta cash, amigo")
    }
};


  return (
    <section>
      <div className='sectionPet'>
        <div className='selectPet'>
      <h3>Elegí una mascota</h3>
      <div className='listPets'>
      <ul className='rpgui-list-imp'>
        {pets ? (
          pets.map((creature) => (
            <li
              className='petList'
              key={creature.name}
              onClick={() => handleSelectPet(creature)}>
              {creature.name}
            </li>
          ))
        )
        :(
          <p>Cargando mascotas...</p>
        )}
         </ul>
      </div>
      </div>
      <div className='containerPets'>
      {selectedPet && (
          <div className='containerPets'>
            <div className='imgPetandSelect'>
              <img className='imgPet' src={selectedPet.img} alt={selectedPet.name} />
              {isBuyable? 
                  <div className='costSect'>
                    <button onClick={() => handleBuy(selectedPet.name, selectedPet.cost ?? 0)} className='rpgui-button'>Adoptar</button>
                    <p className='petText'><strong>Costo:</strong> {selectedPet.cost} materiales </p> 
                  </div>
                : <button onClick={handleSelectedPet} className='rpgui-button'>Seleccionar</button> 
                }
            </div> 
            <div className='containerPetStats'>
              <h3>Detalles de {selectedPet.name}</h3>
                <p className='petText'><strong>Tipo:</strong> {selectedPet.type}</p>
                <p className='petText'><strong>Alineación:</strong> {selectedPet.alignment}</p>
                <p className='petText'><strong>Puntos de vida:</strong> {selectedPet.hitPoints}</p>
                <p className='petText'><strong>Clase de armadura:</strong> {selectedPet.armorClass}</p>
                <p className='petText'><strong>Ataque:</strong> {selectedPet.attack.melee}</p>
                <p className='petText'><strong>Habilidades especiales:</strong> {selectedPet.specialAbilities.join(', ')}</p>
            </div>
          </div>
  
      )}
      </div>
      </div>
      <BackButton/>
      {showMessage && (
        <MessageBox
          message = {messageContent}
          type= {messageType as "error" | "warning" | "success"}
          onClose={handleClose}
        />
      )}
    </section>
  );
}
