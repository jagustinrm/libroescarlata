// CellMap.tsx
// import React from 'react';
import { useHomeContext } from '../../context/HomeContext';

export default function CellMap({ index }: { index: number }) {
  const { gridData, addItemToCell } = useHomeContext();

  return (
    <div
      onClick={() => addItemToCell(index)}
      style={{
        width: '100%', // Ancho fijo de la celda
        height: '100%', // Altura fija de la celda
        border: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: gridData[index]?.name ? '#f0f0f0' : '#66BB6A', // Fondo si está ocupada o vacía
      }}
    >
      {gridData[index]?.name || ''}
    </div>
  );
}
