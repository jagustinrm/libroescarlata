import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import { Creature } from "../../stores/types/creatures";

// Definir tipos para las posiciones y botones
interface Position {
  x: number;
  y: number;
}

interface Button {
  x: number;
  y: number;
}

interface GameBoardProps {
  setCanAttack: React.Dispatch<React.SetStateAction<boolean>>;
  creature: Creature | null;
  setTurn: React.Dispatch<React.SetStateAction<"player" | "enemy">>;
  turn: "player" | "enemy";
  playerPosition: Position;
  enemyPosition: Position;
  setPlayerPosition: React.Dispatch<React.SetStateAction<Position>>;
  setEnemyPosition: React.Dispatch<React.SetStateAction<Position>>;
}

const GameBoard: React.FC<GameBoardProps> = ({
  setCanAttack,
  creature,
  setTurn,
  playerPosition,
  setPlayerPosition,
  enemyPosition,
  turn,
}) => {
  const totalButtons = 100; // Número total de botones
  const step = 5; // Tamaño del paso en vw
  const offsetX = 10 / 1.2;
  const offsetY = 20 / 1.5;

  // Estados para los botones
  const [buttons, setButtons] = useState<Button[]>([]);

  // Generar botones al montar el componente
  useEffect(() => {
    const generatedButtons: Button[] = [];
    for (let i = 1; i <= totalButtons; i++) {
      const groupX = Math.floor((i - 1) / 10) * step; // Incremento en X cada 10 botones
      const translateY = 45 - ((i - 1) % 10) * step; // Descendente en Y
      generatedButtons.push({ x: groupX, y: translateY });
    }
    setButtons(generatedButtons);
  }, []);

  // Manejador para mover al jugador
  const handleButtonClick = (button: Button) => {
    const isWithinRange =
      Math.abs(button.x - playerPosition.x - offsetX) <= 3 * step &&
      Math.abs(button.y - playerPosition.y - offsetY) <= 3 * step;

    if (isWithinRange) {
      if (turn === "player") {
        setPlayerPosition({ x: button.x - offsetX, y: button.y - offsetY });
      }

      setTurn("enemy");
    }
  };

  // Calcular si un botón está en el rango permitido
  const isButtonHighlighted = (button: Button): boolean => {
    return (
      Math.abs(button.x - playerPosition.x - offsetX) <= 3 * step &&
      Math.abs(button.y - playerPosition.y - offsetY) <= 3 * step
    );
  };

  // Verificar si el enemigo está cerca
  const near = (): boolean => {
    const distanceX = Math.abs(playerPosition.x - enemyPosition.x);
    const distanceY = Math.abs(playerPosition.y - enemyPosition.y);
    return distanceX <= 5 && distanceY <= 5;
  };

  // Efecto para actualizar el estado de `canAttack`
  useEffect(() => {
    setCanAttack(near());
  }, [playerPosition, setCanAttack]);

  return (
    <div className="containerGameBoard">
      {buttons.map((button, index) => (
        <div
          key={index}
          className={`bottom ${isButtonHighlighted(button) ? "highlighted" : ""}`}
          style={{
            transform: `translate(${button.x}vw, ${button.y}vw)`,
          }}
          onClick={() => handleButtonClick(button)}
        />
      ))}
      <img
        src="/experimentarImg/wolfAlfa.png"
        alt="Lobo"
        className="lobo"
        style={{
          transform: `translate(${playerPosition.x}vw, ${playerPosition.y}vw) rotateX(-30deg) rotateZ(-45deg)`,
        }}
      />
      <img
        src={creature?.img}
        alt="Enemigo"
        className="enemy"
        style={{
          transform: `translate(${enemyPosition.x}vw, ${enemyPosition.y}vw) rotateX(-30deg) rotateZ(-45deg)`,
        }}
      />
    </div>
  );
};

export default GameBoard;
