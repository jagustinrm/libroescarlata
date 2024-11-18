import React, { useState, useEffect } from 'react';

export default function PetStore() {
  // Estado para almacenar las criaturas y la mascota seleccionada
  const [pets, setpets] = useState<any[]>([]);
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

  return (
    <div>
      <h1>Selecciona tu mascota</h1>
      <div>
        {pets? (
          pets.map((creature) => (
            <button
              key={creature.name}
              onClick={() => handleSelectPet(creature.name)}
              style={{
                margin: '10px',
                padding: '10px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
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
          <p>
            {pets
              .filter((pets) => pets.name === selectedPet)
              .map((creature) => (
                <div key={creature.name}>
                  <p><strong>Tipo:</strong> {creature.type}</p>
                  <p><strong>Alineación:</strong> {creature.alignment}</p>
                  <p><strong>Puntos de vida:</strong> {creature.hitPoints}</p>
                  <p><strong>Clase de armadura:</strong> {creature.armorClass}</p>
                  <p><strong>Habilidades especiales:</strong> {creature.specialAbilities.join(', ')}</p>
                </div>
              ))}
          </p>
        </div>
      )}
    </div>
  );
}
