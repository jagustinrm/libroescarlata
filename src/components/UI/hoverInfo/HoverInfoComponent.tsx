import useAppStore from "../../../stores/appStore";

export const HoverInfo = () => {
    const { hoverInfo } = useAppStore();
    if (!hoverInfo) return null;
    return (
      <div
        className="hover-tooltip"
        style={{
          top: `${hoverInfo.y + 10 }px`, 
          left: `${hoverInfo.x + 10}px`,
        }}
      >
        <p>{hoverInfo.description}</p>
        {typeof hoverInfo.armorValue === "number" && (
          <p>Armadura: {hoverInfo.armorValue}</p>
        )}
        {hoverInfo.damage && hoverInfo.damageMax && (
          <p>Daño: {hoverInfo.damage} - {hoverInfo.damageMax}</p>
        )}
        {hoverInfo.levelRequirement && (
          <p>Requiere Nivel: {hoverInfo.levelRequirement}</p>
        )}
      </div>
    );
  };
  