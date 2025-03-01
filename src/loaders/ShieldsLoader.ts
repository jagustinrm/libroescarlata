import { useEffect } from 'react';
import useArmorStore from '../stores/armorStore';
import { Armor } from '../stores/types/armor';

const ArmorsLoader = () => {
  const { areShieldsLoaded, setShields } = useArmorStore();

  // Importa todas las imágenes como promesas de módulos con .default
  const images = import.meta.glob('/src/assets/img/shields/*.png') as Record<
    string,
    () => Promise<{ default: string }>
  >;

  useEffect(() => {
    if (!areShieldsLoaded) {
      const loadShields = async () => {
        try {
          const res = await fetch('/mocks/shields.json');
          const data: Armor[] = await res.json();

          // Mapea las armaduras del JSON y resuelve las rutas de las imágenes
          const armorsWithImages = await Promise.all(
            data.map(async (armor) => {
              const imagePath = `/src/assets/img/shields/${armor.img}`;
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

          setShields(armorsWithImages);
        } catch (error) {
          console.error('Error loading armors:', error);
        }
      };

      loadShields();
    }
  }, [areShieldsLoaded, setShields]);

  return null;
};

export default ArmorsLoader;
