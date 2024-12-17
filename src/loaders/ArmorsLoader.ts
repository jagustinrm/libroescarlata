import { useEffect } from 'react';
import useArmorStore from '../stores/armorStore';

const ArmorsLoader = () => {
  const { areArmorsLoaded, setArmors } = useArmorStore();

  useEffect(() => {
    if (!areArmorsLoaded) {
      const loadArmors = async () => {
        try {
          const res = await fetch('/mocks/armors.json');
          const data = await res.json();
          setArmors(data);
        } catch (error) {
          console.error('Error loading armors:', error);
        }
      };

      loadArmors();
    }
  }, [areArmorsLoaded, setArmors]);

  return null;
};

export default ArmorsLoader;
