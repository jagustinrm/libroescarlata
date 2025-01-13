import useGlobalState from "../../customHooks/useGlobalState";

const PlayerEquipment = () => {
  const { player } = useGlobalState();

  // Función para determinar si una parte del cuerpo tiene imagen o no
  const hasImage = (part: any) => part?.img;

  return (
    <div className="rpgui-container framed-golden-2 containerEquipment">
      <img
        className={`head ${!hasImage(player.bodyParts?.cabeza) ? 'default-image' : ''}`}
        src={player.bodyParts?.cabeza?.img || "img/armors/casco.png"}
        alt="Head Item"
      />
      <img
        className={`chest ${!hasImage(player.bodyParts?.pecho) ? 'default-image' : ''}`}
        src={player.bodyParts?.pecho?.img || "img/armors/leatherArmor.png"}
        alt="Chest Item"
      />
      <img
        className={`belt ${!hasImage(player.bodyParts?.cintura) ? 'default-image' : ''}`}
        src={player.bodyParts?.cintura?.img || "img/armors/cinturón.png"}
        alt="Belt Item"
      />
      <img
        className={`back ${!hasImage(player.bodyParts?.espalda) ? 'default-image' : ''}`}
        src={player.bodyParts?.espalda?.img || "img/armors/capeplaceholder.png"}
        alt="Back Item"
      />
      <img
        className={`boots ${!hasImage(player.bodyParts?.pies) ? 'default-image' : ''}`}
        src={player.bodyParts?.pies?.img || "img/armors/bootsplaceholder.png"}
        alt="Boots Item"
      />
      <img
        className={`gloves ${!hasImage(player.bodyParts?.manos) ? 'default-image' : ''}`}
        src={player.bodyParts?.manos?.img || "img/armors/glovesplaceholder.png"}
        alt="Gloves Item"
      />
      <img
        className={`legs ${!hasImage(player.bodyParts?.piernas) ? 'default-image' : ''}`}
        src={player.bodyParts?.piernas?.img || "img/armors/leal-pantalones-metal-oso.png"}
        alt="Legs Item"
      />
      <img
        className={`face ${!hasImage(player.bodyParts?.cara) ? 'default-image' : ''}`}
        src={player.bodyParts?.cara?.img || "img/armors/máscara.png"}
        alt="Face Item"
      />
      <img
        className={`shoulder ${!hasImage(player.bodyParts?.hombros) ? 'default-image' : ''}`}
        src={player.bodyParts?.hombros?.img || "img/armors/hombreras.png"}
        alt="Shoulder Item"
      />
    </div>
  );
};

export default PlayerEquipment;
