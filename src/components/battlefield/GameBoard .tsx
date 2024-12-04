import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import { CreatureInterface } from "../interfaces/CreatureInterface";

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
  enemy: CreatureInterface | null
}

const GameBoard: React.FC<GameBoardProps> = ({ setCanAttack, enemy }) => {
  const totalButtons = 100; // Número total de botones
  const step = 5; // Tamaño del paso en vw
  const initialX = 0;
  const initialY = 45;
  // Compensar el ancho y alto de la imagen
  const offsetX = 10 / 1.2;
  const offsetY = 20 / 1.5;
  // Estados para posiciones y botones
  const [loboPosition, setLoboPosition] = useState<Position>({
    x: initialX - offsetX,
    y: initialY - offsetY,
  });
  const [enemyPosition, setEnemyPosition] = useState<Position>({
    x: 45 - offsetX,
    y: 0 - offsetY,
  });
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

  // Función para mover el enemigo hacia el lobo
  const moveEnemy = () => {
    const deltaX = loboPosition.x - enemyPosition.x;
    const deltaY = loboPosition.y - enemyPosition.y;

    const stepSize = step;

    const newX =
      Math.abs(deltaX) > stepSize
        ? enemyPosition.x + (deltaX > 0 ? stepSize : -stepSize)
        : enemyPosition.x;

    const newY =
      Math.abs(deltaY) > stepSize
        ? enemyPosition.y + (deltaY > 0 ? stepSize : -stepSize)
        : enemyPosition.y;

    setEnemyPosition({ x: newX, y: newY });
  };

  // Manejador para mover el lobo
  const handleButtonClick = (button: Button) => {
    const isWithinRange =
      Math.abs(button.x - loboPosition.x - offsetX) <= 3 * step &&
      Math.abs(button.y - loboPosition.y - offsetY) <= 3 * step;

    if (isWithinRange) {
      setLoboPosition({ x: button.x - offsetX, y: button.y - offsetY });
      moveEnemy();
    }
  };

  // Calcular si un botón está en el rango permitido
  const isButtonHighlighted = (button: Button): boolean => {
    return (
      Math.abs(button.x - loboPosition.x - offsetX) <= 3 * step &&
      Math.abs(button.y - loboPosition.y - offsetY) <= 3 * step
    );
  };

  // Verificar si el enemigo está cerca
  const near = (): boolean => {
    const distanceX = Math.abs(loboPosition.x - enemyPosition.x);
    const distanceY = Math.abs(loboPosition.y - enemyPosition.y);
    return distanceX <= step && distanceY <= step;
  };

  // Efecto para actualizar el estado de `canAttack`
  useEffect(() => {
    setCanAttack(near());
  }, [loboPosition, enemyPosition, setCanAttack]);

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
          transform: `translate(${loboPosition.x}vw, ${loboPosition.y}vw) rotateX(-30deg) rotateZ(-45deg)`,
        }}
      />
      <img
        src={enemy?.img}
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
