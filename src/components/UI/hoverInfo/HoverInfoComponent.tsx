import useAppStore from "../../../stores/appStore";
import usePlayerStore from "../../../stores/playerStore";
import { bodyParts } from "../../../stores/types/others";

export const HoverInfo = () => {
    const { hoverInfo } = useAppStore();
    const {damage, damageMax} = usePlayerStore(state => state.player.bodyParts.manoDerecha);
    
    const {bodyParts} = usePlayerStore(state => state.player);
    if (!hoverInfo) return null;
    const damageDif = hoverInfo.damage && hoverInfo.damage - damage
    const maxDamageDif = hoverInfo.damageMax &&  hoverInfo.damageMax - damageMax
    const differenceColor = damageDif && damageDif > 0 ? 'lightGreen' : 'red'
    const maxDifferenceColor = maxDamageDif && maxDamageDif > 0 ? 'lightGreen' : 'red'
    const armorDif = bodyParts[hoverInfo.bodyPart as keyof bodyParts] && hoverInfo.armorValue && hoverInfo.armorValue - bodyParts[hoverInfo.bodyPart as keyof bodyParts].armorValue
    const differenceArmorColor = armorDif && armorDif > 0 ? 'lightGreen' : 'red'
    const armorShieldDif = hoverInfo.armorValue && bodyParts.manoIzquierda && hoverInfo.armorValue - bodyParts.manoIzquierda.armorValue
    const differenceShieldArmorColor = armorShieldDif && armorShieldDif > 0 ? 'lightGreen' : 'red'
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
          <p>Armadura: {hoverInfo.armorValue} <span style={{color: hoverInfo.bodyPart === 'manoIzquierda' ? differenceShieldArmorColor : differenceArmorColor}}> {hoverInfo.bodyPart === 'manoIzquierda' ? armorShieldDif : armorDif} </span></p>
        )}
        {hoverInfo.damage && hoverInfo.damageMax && (
          <div>
          <p>Daño: {hoverInfo.damage} (<span style={{color: differenceColor}}>{damageDif}</span>) - {hoverInfo.damageMax} (<span style={{color: maxDifferenceColor}}>{maxDamageDif}</span>)</p>
          
          </div>
        )}
        {hoverInfo.levelRequirement && (
          <p>Requiere Nivel: {hoverInfo.levelRequirement}</p>
        )}
      </div>
    );
  };
  