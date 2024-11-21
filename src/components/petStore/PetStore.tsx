import { useState, useEffect } from 'react';
import './PetStore.css'
import {PetInterface} from '../interfaces/PetInterface'

export default function PetStore() {
  // Estado para almacenar las criaturas y la mascota seleccionada
  const [pets, setpets] = useState<PetInterface[]>([]);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  // Efecto para cargar los datos del JSON
  useEffect(() => {
    // Realizamos el fetch al archivo JSON en la carpeta public
    fetch('/mocks/pets.json')
      .then((response) => response.json())
      .then((data) => {
        setpets(data.pets)  // Guardamos las criaturas en el estado

      })
      .catch((error) => {
        console.error('Error al cargar los datos:', error);
      });
  }, []);  // El segundo parámetro [] asegura que solo se ejecute una vez al montar el componente

  // Función para manejar la selección de una mascota
  const handleSelectPet = (petName: string) => {
    setSelectedPet(petName);
  };

  const handleSelectedPet = (selectedPet: string) => {
    localStorage.setItem('pet', selectedPet)
    alert('Seleccionaste: ' + selectedPet)
  };
  return (
    <section>
      <h1>Selecciona tu mascota</h1>
      <div className='buttonsPet'>
        {pets? (
          pets.map((creature) => (
            <button
              className='buttonPet'
              key={creature.name}
              onClick={() => handleSelectPet(creature.name)}

            >
              {creature.name}
            </button>
          ))
        ) : (
          <p>Cargando mascotas...</p>  // Muestra un mensaje mientras se cargan los datos
        )}
      </div>

      {selectedPet && (
        <div>
          <h2>Detalles de {selectedPet}</h2>
          <div  className='containerPets'>
            {pets
              .filter((pets) => pets.name === selectedPet)
              .map((creature) => (
                <div key={creature.name}>
                  <img className='imgPet' src={creature.img} alt="" />
                  <div className='containerPetStats'>
                    <p><strong>Tipo:</strong> {creature.type}</p>
                    <p><strong>Alineación:</strong> {creature.alignment}</p>
                    <p><strong>Puntos de vida:</strong> {creature.hitPoints}</p>
                    <p><strong>Clase de armadura:</strong> {creature.armorClass}</p>
                    <p><strong>Habilidades especiales:</strong> {creature.specialAbilities.join(', ')}</p>
                  </div> 
                  <button onClick={() => handleSelectedPet(selectedPet)}>Seleccionar</button> 
                </div>
              ))}
          </div>
        </div>
      )}
      <a href="/home"><button>Volver</button></a>
    </section>
  );
}
