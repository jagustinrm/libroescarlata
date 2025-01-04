import { useEffect } from 'react';
import useOtherItemsStore from '../stores/otherItemsStore'; // Ajusta el path según tu estructura de proyecto

const OtherItemsLoader = () => {
  const { areOtherItemsLoaded, setotherItems } = useOtherItemsStore();

  useEffect(() => {
    if (!areOtherItemsLoaded) {
      const loadOtherItems = async () => {
        try {
          const res = await fetch('/mocks/otherItems.json'); // Ajusta el path según tus archivos mock o API
          const data = await res.json();
          setotherItems(data);
        } catch (error) {
          console.error('Error loading other items:', error);
        }
      };

      loadOtherItems();
    }
  }, [areOtherItemsLoaded, setotherItems]);

  return null;
};

export default OtherItemsLoader;
