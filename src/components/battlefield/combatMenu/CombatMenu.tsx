// import React, { useState } from "react";
// import { Player } from "../../../stores/types/player";
// import { Creature } from "../../../stores/types/creatures";
// import { Potion } from "../../../stores/types/potions";
// import { Inventory } from "../../../stores/types/inventory";
// import WeaponSelector from "./WeaponSelector";
// import AttackAndPotions from "./AttackAndPotions";
// import SpellSelector from "./SpellSelector";
// import { handleHealing } from "../../../utils/handleHealing";

// interface CombatMenuProps {
//   player: Player;
//   creature: Creature;
//   inventories: Inventory;
//   potions: Potion[];
//   playerActions: any;
//   handleMessage: (message: string, type: string, isError: boolean) => void;
//   turn: "player" | "enemy" | "summon";
//   fightType: "normal" | "dungeon";
// }

// const CombatMenu: React.FC<CombatMenuProps> = ({
//   player,
//   creature,
//   inventories,
//   potions,
//   playerActions,
//   handleMessage,
//   turn,
//   fightType,
// }) => {
//   const [selectedWeapon, setSelectedWeapon] = useState<string>("");
//   const [selectedSpell, setSelectedSpell] = useState<string>("");

//   const executeAttack = () => {
//     if (turn !== "player") return;
//     setSoundType("attack")
//     handleAction("attack")
//     setTimeout(() => {
//         setSoundType("")
//       }, 300);
//   };


//   const executeSpell = () => {
//     // Lógica para ejecutar hechizo
//   };

//   return (
//     <div className="rpgui-container framed attacks fixedUI">
//       <WeaponSelector
//         inventories={inventories}
//         selectedWeapon={selectedWeapon}
//         setSelectedWeapon={setSelectedWeapon}
//         turn={turn}
//         creatureHealth={creature.health}
//       />
//       <AttackAndPotions
//         creatureHealth={creature.health}
//         playerLeftHealth={player.p_LeftHealth}
//         selectedWeapon={selectedWeapon}
//         executeAttack={executeAttack}
//         pocion={true} // Suponiendo que siempre hay poción para este ejemplo
//         handleHealing={handleHealing}
//         potions={potions}
//       />
//       <SpellSelector
//         spells={player.spells}
//         selectedSpell={selectedSpell}
//         setSelectedSpell={setSelectedSpell}
//         turn={turn}
//         creatureHealth={creature.health}
//         executeSpell={executeSpell}
//       />
//       {fightType === "normal" || player.p_LeftHealth === 0 ? (
//         <button
//           onClick={() =>
//             handleMessage("¡Has huido del combate!", "warning", true)
//           }
//           className="rpgui-button newDesign huir"
//         >
//           😨 Huir
//         </button>
//       ) : null}
//     </div>
//   );
// };

// export default CombatMenu;
