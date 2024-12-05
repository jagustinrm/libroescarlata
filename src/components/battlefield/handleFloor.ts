// // HandleFloor.tsx
// import React from "react";
// import { Position, Button } from "./GameBoard"; // Asegúrate de importar los tipos necesarios

// interface HandleFloorProps {
//   setCharPositions: React.Dispatch<React.SetStateAction<Position[]>>;
//   setTurn: React.Dispatch<React.SetStateAction<"player" | "enemy">>;
//   offsetX: number;
//   offsetY: number;
//   step: number;
// }

// const HandleFloor: React.FC<HandleFloorProps> = ({
//   loboPosition,
//   setLoboPosition,
//   setTurn,
//   offsetX,
//   offsetY,
//   step,
// }) => {
  
//   // Manejador para mover el lobo
//   const handleFloorClick = (button: Button) => {
//     const isWithinRange =
//       Math.abs(button.x - loboPosition.x - offsetX) <= 3 * step &&
//       Math.abs(button.y - loboPosition.y - offsetY) <= 3 * step;

//     if (isWithinRange) {
//       setLoboPosition({ x: button.x - offsetX, y: button.y - offsetY });
//       setTurn("enemy");
//     }
//   };

//   // Calcular si un botón está en el rango permitido
//   const isFloorHighlighted = (button: Button): boolean => {
//     return (
//       Math.abs(button.x - loboPosition.x - offsetX) <= 3 * step &&
//       Math.abs(button.y - loboPosition.y - offsetY) <= 3 * step
//     );
//   };

//   return { handleFloorClick, isFloorHighlighted };
// };

// export default HandleFloor;
