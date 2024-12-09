import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import { Creature } from "../../stores/types/creatures";
import { SoundPlayerProps } from "../UI/soundPlayer/SoundPlayer";
import { handleCombatAction } from "../../utils/combatHandlers";
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
  setTurn: React.Dispatch<React.SetStateAction<"player" | "enemy" | "summon">>;
  turn: "player" | "enemy" | "summon";
  playerPosition: Position;
  enemyPosition: Position;
  setPlayerPosition: React.Dispatch<React.SetStateAction<Position>>;
  setEnemyPosition: React.Dispatch<React.SetStateAction<Position>>;
  SoundPlayer: React.FC<SoundPlayerProps>;
  playerImg: string;
  summon?: Creature | null
  setSummon: React.Dispatch<React.SetStateAction<Creature | null>>;
  summonPosition: Position;
  switchTurn: () => void
  // setSummonPosition: React.Dispatch<React.SetStateAction<Position>>;
}

const GameBoard: React.FC<GameBoardProps> = ({
  setCanAttack,
  creature,
  setTurn,
  playerPosition,
  setPlayerPosition,
  enemyPosition,
  turn,
  SoundPlayer,
  playerImg,
  summon,
  summonPosition,
  switchTurn
  // setSummon,
}) => {
  const totalButtons = 100; // Número total de botones
  const step = 5; // Tamaño del paso en vw
  const offsetX = 10 / 1.2;
  const offsetY = 20 / 1.5;

  // Estados para los botones
  const [buttons, setButtons] = useState<Button[]>([]);
  const [playSound, setPlaySound] = useState(false);

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
  // const handleButtonClick = (button: Button) => {
  //   const isWithinRange =
  //     Math.abs(button.x - playerPosition.x - offsetX) <= 3 * step &&
  //     Math.abs(button.y - playerPosition.y - offsetY) <= 3 * step;

  //   if (isWithinRange) {
  //     if (turn === "player") {
  //       setPlayerPosition({ x: button.x - offsetX, y: button.y - offsetY });
  //       setPlaySound(true); // Activar sonido
  //     }
  //     setTimeout(() => {
  //       setPlaySound(false);
  //     }, 300);
  //     setTurn("enemy");
  //   }
  // };
  const handleAction = (actionType: "attack" | "spell" | "move", additionalData?: any) => {
    handleCombatAction(actionType, {
      // creature,
      playerPosition,
      // enemyPosition,
      setPlayerPosition,
      setTurn,
      turn, switchTurn
    }, additionalData);
  
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
    return distanceX <= 10 && distanceY <= 10;
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
          // onClick=
          // {() => 
          //   handleButtonClick({
          //   playerPosition, 
          //   setPlayerPosition, 
          //   setTurn, 
          //   turn
          // }, button)}
          onClick={() => 
            handleAction("move", button)
          }
        />
      ))}
      <img
        src={playerImg}
        alt="player"
        className="playerChar"
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
      {/* Mostrar la imagen del summon si existe */}
      {summon && (
        <img
          src={summon.img}  // Asumiendo que summon tiene una propiedad 'img' que contiene la URL
          alt="Summon"
          className="summon"
          style={{
            transform: `translate(${summonPosition.x}vw, ${summonPosition.y}vw) rotateX(-30deg) rotateZ(-45deg)`, // Ajusta la posición al lado del jugador
          }}
        />
      )}
      {playSound && <SoundPlayer soundType="charStep" volume={1} />}
    </div>
  );
};

export default GameBoard;
