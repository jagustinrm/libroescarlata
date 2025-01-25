import { useEffect } from 'react';
import useArmorStore from '../stores/armorStore';
import { Armor } from '../stores/types/armor';

const ArmorsLoader = () => {
  const { areArmorsLoaded, setArmors } = useArmorStore();

  // Importa todas las imágenes como promesas de módulos con .default
  const images = import.meta.glob('/src/assets/img/armors/*.png') as Record<
    string,
    () => Promise<{ default: string }>
  >;

  useEffect(() => {
    if (!areArmorsLoaded) {
      const loadArmors = async () => {
        try {
          const res = await fetch('/mocks/armors.json');
          const data: Armor[] = await res.json();

          // Mapea las armaduras y resuelve las rutas de las imágenes
          const armorsWithImages = await Promise.all(
            data.map(async (armor) => {
              const imagePath = `/src/assets/img/armors/${armor.img}`;
              if (images[imagePath]) {
                try {
                  const module = await images[imagePath]();
                  return { ...armor, img: module.default };
                } catch {
                  console.error(`Error loading image for ${armor.img}`);
                }
              }
              return armor; // Si no se encuentra la imagen, devuelve el objeto original
            }),
          );

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
