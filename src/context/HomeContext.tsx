/* eslint-disable @typescript-eslint/no-unused-vars */
// IMPORTANTE ELIMINAR LO DE ARRIBA, SIRVE PARA CANCELAR TS

// HomeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface HomeContextType {
  gridWidth: number;
  gridHeight: number;
  gridData: GridItem[];
  addItemToCell: (index: number) => void;
}

interface GridItem {
  name: string;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider = ({ children }: { children: ReactNode }) => {
  const [gridWidth] = useState(10); // Ancho de la cuadrícula
  const [gridHeight] = useState(5); // Altura de la cuadrícula
  const [gridData] = useState<GridItem[]>(
    Array(gridWidth * gridHeight).fill({ name: '' }),
  );

  const addItemToCell = (index: number) => {
    // Lógica para añadir un ítem a la celda
    console.log(index);
  };

  return (
    <HomeContext.Provider
      value={{ gridWidth, gridHeight, gridData, addItemToCell }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext debe usarse dentro de un HomeProvider');
  }
  return context;
};
