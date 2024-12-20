// import React from 'react';
import { useHomeContext } from '../../context/HomeContext';
import CellMap from './CellMap';

export default function Grid() {
  const { gridWidth, gridHeight } = useHomeContext();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridWidth}, 1fr)`, // Divide el espacio en columnas iguales
        gridTemplateRows: `repeat(${gridHeight}, 1fr)`, // Divide el espacio en filas iguales
        backgroundColor: '#7CFC00', // Fondo verde claro
        width: '50vw', // Ancho de 50% de la pantalla
        height: '50vh', // Altura de 50% de la pantalla
        margin: '0 auto', // Centra la cuadrícula en el contenedor
        placeItems: 'center', // Centra las celdas en el contenedor
      }}
    >
      {Array.from({ length: gridWidth * gridHeight }).map((_, index) => (
        <CellMap key={index} index={index} />
      ))}
    </div>
  );
}
