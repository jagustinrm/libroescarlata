import useGlobalState from "../../customHooks/useGlobalState";
import { darkenHex } from "../../utils/darkenHex";

const PlayerEquipment = () => {
  const { player } = useGlobalState();

  // Función para determinar si una parte del cuerpo tiene imagen o no
  const hasImage = (part: any) => part?.img;

  const generateImage = (partName: string, partData: any, defaultImg: string, className: string) => {
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

// Lista de partes del cuerpo
const bodyParts = [
  { name: 'head', data: player.bodyParts?.cabeza, defaultImg: 'img/armors/casco.png', className: 'head' },
  { name: 'chest', data: player.bodyParts?.pecho, defaultImg: 'img/armors/leatherArmor.png', className: 'chest' },
  { name: 'belt', data: player.bodyParts?.cintura, defaultImg: 'img/armors/cinturón.png', className: 'belt' },
  { name: 'back', data: player.bodyParts?.espalda, defaultImg: 'img/armors/capeplaceholder.png', className: 'back' },
  { name: 'boots', data: player.bodyParts?.pies, defaultImg: 'img/armors/bootsplaceholder.png', className: 'boots' },
  { name: 'gloves', data: player.bodyParts?.manos, defaultImg: 'img/armors/glovesplaceholder.png', className: 'gloves' },
  { name: 'legs', data: player.bodyParts?.piernas, defaultImg: 'img/armors/leal-pantalones-metal-oso.png', className: 'legs' },
  { name: 'face', data: player.bodyParts?.cara, defaultImg: 'img/armors/máscara.png', className: 'face' },
  { name: 'shoulder', data: player.bodyParts?.hombros, defaultImg: 'img/armors/hombreras.png', className: 'shoulder' },
];

// Renderizado
return (
  <div className="rpgui-container framed-golden-2 containerEquipment">
    {bodyParts.map(({ name, data, defaultImg, className }) =>
      generateImage(name, data, defaultImg, className)
    )}
  </div>
);
};

export default PlayerEquipment;
