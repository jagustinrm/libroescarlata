// HomeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    const [gridWidth, setGridWidth] = useState(10);  // Ancho de la cuadrícula
    const [gridHeight, setGridHeight] = useState(5); // Altura de la cuadrícula
    const [gridData, setGridData] = useState<GridItem[]>(Array(gridWidth * gridHeight).fill({ name: '' }));

    const addItemToCell = (index: number) => {
        // Lógica para añadir un ítem a la celda
    };

    return (
        <HomeContext.Provider value={{ gridWidth, gridHeight, gridData, addItemToCell }}>
            {children}
        </HomeContext.Provider>
    );
};

export const useHomeContext = () => {
    const context = useContext(HomeContext);
    if (!context) {
        throw new Error("useHomeContext debe usarse dentro de un HomeProvider");
    }
    return context;
};
