import { useEffect } from 'react';
import useArmorStore from '../stores/armorStore';
import { Armor } from '../stores/types/armor';

const ArmorsLoader = () => {
  const { areArmorsLoaded, setArmors } = useArmorStore();

  // Importa todas las imágenes de la carpeta
  const images = import.meta.glob('/src/assets/img/armors/*.png', { eager: true });
  console.log(images, "imagenes")
  useEffect(() => {
    if (!areArmorsLoaded) {
      const loadArmors = async () => {
        try {
          const res = await fetch('/mocks/armors.json');
          const data = await res.json();

          // Reemplaza la propiedad img con las rutas importadas
          const armorsWithImages = data.map((armor: Armor) => ({
            ...armor,
            img: images[`/src/assets/img/armors/${armor.img}`] || armor.img,
          }));

          setArmors(armorsWithImages);
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
