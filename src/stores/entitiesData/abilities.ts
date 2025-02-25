import { calculatStatReg } from "../../utils/calculateStats";
import usePlayerStore from "../playerStore";

export const abilities = {
    movement: 0, // nuevo
    turnSpeed: 0, //nuevo
    blockChance: 0, //nuevo
    parry: 0, //nuevo
    critChance: 0, // nuevo
    critDamage: 0, //nuevo
    spellHitRate: 0, //nuevo
    spellPenetration: 0, //nuevo
    spellCrit: 0, //nuevo
    spellDmg: 0, //nuevo
    c_conditions: [],
    spiritReg: () => {
        const int = usePlayerStore.getState().player.stats.int;
        const weaponSpiritReg = usePlayerStore.getState().player.bodyParts.manoDerecha.spiritReg
        return calculatStatReg(int, weaponSpiritReg);
      },
    healthReg: () => {
        const con = usePlayerStore.getState().player.stats.con;
        const weaponHealthReg = usePlayerStore.getState().player.bodyParts.manoDerecha.healthReg
        return calculatStatReg(con, weaponHealthReg);
      },
    healingPower: 0, //nuevo
}
