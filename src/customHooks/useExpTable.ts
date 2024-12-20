import { useState, useEffect } from 'react';

interface ExpTable {
  [level: string]: number;
}

export default function useExpTable(): {
  expTable: ExpTable | undefined;
  setExpTable: React.Dispatch<React.SetStateAction<ExpTable | undefined>>;
} {
  const [expTable, setExpTable] = useState<ExpTable | undefined>();

  useEffect(() => {
    // Cargar el JSON al montar el componente
    const loadXpTable = async () => {
      try {
        const response = await fetch('/mocks/levelDictionary.json');
        const data: ExpTable = await response.json();
        setExpTable(data); // Guardar el JSON en el estado
      } catch (error) {
        console.error('Error loading XP table:', error);
      }
    };

    loadXpTable();
  }, []);

  return { expTable, setExpTable };
}
