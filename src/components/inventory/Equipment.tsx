import useGlobalState from '../../customHooks/useGlobalState';
import { darkenHex } from '../../utils/darkenHex';

const PlayerEquipment = () => {
  const { player } = useGlobalState();

  // Función para determinar si una parte del cuerpo tiene imagen o no
  const hasImage = (part: any) => part?.img;

  const generateImage = (
    partName: string,
    partData: any,
    defaultImg: string,
    className: string,
  ) => {
    const color = partData?.color || null;

    // Estilos dinámicos basados en el color
    const dynamicStyle = color
      ? {
          borderColor: darkenHex(color, 90, 1),
          boxShadow: `0px 0px 1px 3px ${darkenHex(color, 30, 1)}, 0px 0px 0px 4px ${darkenHex(color, 90, 1)}`,
          background: `linear-gradient(0deg, ${darkenHex(color, 70, 0.8)} 10%, ${darkenHex(color, 40)} 50%, ${darkenHex(color, 10)} 70%)`,
        }
      : {};

    return (
      <img
        key={partName}
        className={`${className} ${!hasImage(partData) ? 'default-image' : ''}`}
        src={partData?.img || defaultImg}
        alt={`${partName} Item`}
        style={dynamicStyle}
      />
    );
  };

  type BodyPartKey = keyof typeof player.bodyParts;

  const bodyPartsConfig: { key: BodyPartKey; name: string; defaultImg: string }[] = [
    { key: 'cabeza', name: 'head', defaultImg: 'img/armors/casco.png' },
    { key: 'pecho', name: 'chest', defaultImg: 'img/armors/leatherArmor.png' },
    { key: 'cintura', name: 'belt', defaultImg: 'img/armors/cinturón.png' },
    { key: 'espalda', name: 'back', defaultImg: 'img/armors/capeplaceholder.png' },
    { key: 'pies', name: 'boots', defaultImg: 'img/armors/bootsplaceholder.png' },
    { key: 'manos', name: 'gloves', defaultImg: 'img/armors/glovesplaceholder.png' },
    { key: 'piernas', name: 'legs', defaultImg: 'img/armors/leal-pantalones-metal-oso.png' },
    { key: 'cara', name: 'face', defaultImg: 'img/armors/máscara.png' },
    { key: 'hombros', name: 'shoulder', defaultImg: 'img/armors/hombreras.png' },
  ];
  
  const bodyParts = bodyPartsConfig.map(({ key, name, defaultImg }) => ({
    name,
    data: player.bodyParts?.[key],
    defaultImg,
    className: name,
  }));

  // Renderizado
  return (
    <div className="containerEquipment" >
      {bodyParts.map(({ name, data, defaultImg, className }) =>
        generateImage(name, data, defaultImg, className),
      )}
    </div>
  );
};

export default PlayerEquipment;
