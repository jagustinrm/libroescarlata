import { useEffect } from 'react';
import { useWeaponStore } from '../stores/weaponStore';

const WeaponLoader = () => {
  const { areWeaponsLoaded, setWeapons } = useWeaponStore();

  useEffect(() => {
    if (!areWeaponsLoaded) {
      const loadWeapons = async () => {
        try {
          const res = await fetch('/mocks/weapons.json');
          const data = await res.json();
          setWeapons(data.weapons);
        } catch (error) {
          console.error('Error loading classes:', error);
        }
      };

      loadWeapons();
    }
  }, [areWeaponsLoaded, setWeapons]);

  return null;
};
export default WeaponLoader;

