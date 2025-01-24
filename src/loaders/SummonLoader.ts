import { useEffect } from 'react';
import useSummonStore from '../stores/summonsStore';

const SummonLoader = () => {
  const { areSummonsLoaded, setSummons } = useSummonStore();

  useEffect(() => {
    if (!areSummonsLoaded) {
      const loadClasses = async () => {
        try {
          const res = await fetch('/mocks/summons.json');
          const data = await res.json();
          setSummons(data);
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
