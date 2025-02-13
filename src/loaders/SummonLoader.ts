import { useEffect } from 'react';
import useSummonStore from '../stores/summonsStore';
import { Summon } from '../stores/types/summons';

const SummonLoader = () => {
  const { areSummonsLoaded, setSummons, summon } = useSummonStore();
  useEffect(() => {
    if (!areSummonsLoaded) {
      const loadClasses = async () => {
        try {
          const res = await fetch('/mocks/summons.json');
          const data = await res.json();
          const baseSummon = summon;
          const summonWithBase = data.map((summon: Summon) => ({
            ...baseSummon,
            ...summon,
          }));
          setSummons(summonWithBase);
        } catch (error) {
          console.error('Error loading summons:', error);
        }
      };

      loadClasses();
    }
  }, [areSummonsLoaded, setSummons]);

  return null;
};
export default SummonLoader;
