import { useEffect, useState } from 'react';

export function useLoadWeapons() {
  const [weapons, setWeapons] = useState([]);

  useEffect(() => {
    // Cargar armas desde el archivo JSON
    const loadInitWeapons = async () => {
      try {
        const res = await fetch('/mocks/weapons.json');
        const data = await res.json();
        setWeapons(data.weapons || []);
      } catch (error) {
        console.error('Error loading weapons:', error);
        setWeapons([]);
      }
    };

    loadInitWeapons();
  }, []);

  return { weapons };
}
