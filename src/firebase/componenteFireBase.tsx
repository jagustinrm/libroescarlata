import React from 'react';
import { database } from './firebaseConfig';
import { ref, set } from 'firebase/database';

const TestFirebase: React.FC = () => {
  const handleWriteData = () => {
    const testRef = ref(database, 'test'); // Crea una referencia en la base de datos
    set(testRef, {
      message: "Conexión exitosa con Firebase!",
      timestamp: Date.now(),
    })
      .then(() => {
        alert('¡Datos escritos correctamente!');
      })
      .catch((error) => {
        console.error('Error al escribir datos:', error);
      });
  };

  return (
    <div>
      <h1>Prueba de Conexión con Firebase</h1>
      <button onClick={handleWriteData}>Escribir datos de prueba</button>
    </div>
  );
};

export default TestFirebase;
