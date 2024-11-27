import { useState, useEffect } from 'react';
import './PetStore.css';
import '../designRpg.css'
import { usePetStore } from '../../stores/petsStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import { Pet } from '../../stores/types/pets';
export default function PetStore() {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null); // Guardamos el objeto completo
  const { pets, setPets } = usePetStore();
  const { playerActions } = usePlayerStore();
  const navigate = useNavigate();  // Declaramos la función navigate
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
    console.log(creature)
    setSelectedPet(creature); // Guarda la mascota seleccionada
  };

  // Función para manejar la confirmación de la mascota seleccionada
  const handleSelectedPet = () => {
    if (selectedPet) {
      playerActions.setP_SelectedPet(selectedPet); // Guarda el selectedPet en el store de player
      alert('Seleccionaste: ' + selectedPet.name); // Muestra el nombre de la mascota seleccionada
    }
  };
  const handleGoBack = () => {
    navigate('/home');  // Redirige a la ruta "/home"
  };
  return (
    <section>
      <h1>Selecciona tu mascota</h1>
      <div className='buttonsPet'>
        {pets ? (
          pets.map((creature) => (
            <button
              className='buttonPet rpgui-button'
              key={creature.name}
              onClick={() => handleSelectPet(creature)} // Pasa el objeto completo
            >
              {creature.name}
            </button>
          ))
        ) : (
          <p>Cargando mascotas...</p>
        )}
      </div>

      {selectedPet && (
        <div>
          <h2>Detalles de {selectedPet.name}</h2>
          <div className='containerPets'>
              <img className='imgPet' src={selectedPet.img} alt={selectedPet.name} />
              <div className='containerPetStats'>
                <p className='petText'><strong>Tipo:</strong> {selectedPet.type}</p>
                <p className='petText'><strong>Alineación:</strong> {selectedPet.alignment}</p>
                <p className='petText'><strong>Puntos de vida:</strong> {selectedPet.hitPoints}</p>
                <p className='petText'><strong>Clase de armadura:</strong> {selectedPet.armorClass}</p>
                <p className='petText'><strong>Ataque:</strong> {selectedPet.attack.melee}</p>
                <p className='petText'><strong>Habilidades especiales:</strong> {selectedPet.specialAbilities.join(', ')}</p>
              </div>
              <button onClick={handleSelectedPet} className='rpgui-button'>Seleccionar</button> {/* Solo guarda la mascota en el player cuando se hace clic aquí */}
          </div>
        </div>
      )}
     <button onClick={handleGoBack} className='rpgui-button'>Volver</button> 
    </section>
  );
}
