import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import { Creature } from "../../stores/types/creatures";
import { SoundPlayerProps } from "../UI/soundPlayer/SoundPlayer";
import { handleCombatAction } from "../../utils/combatHandlers";
import usePlayerStore from "../../stores/playerStore";
import useCreatureStore from "../../stores/creatures";

interface Position {
  x: number;
  y: number;
}

interface Button {
  x: number;
  y: number;
  type: "main" | "border";
}

interface GameBoardProps {
  // setCanAttack: React.Dispatch<React.SetStateAction<boolean>>;
  turn: "player" | "enemy" | "summon";
  playerPosition: Position;
  enemyPosition: Position;
  setPlayerPosition: React.Dispatch<React.SetStateAction<Position>>;
  setEnemyPosition: React.Dispatch<React.SetStateAction<Position>>;
  SoundPlayer: React.FC<SoundPlayerProps>;
  summon?: Creature | null;
  setSummon: React.Dispatch<React.SetStateAction<Creature | null>>;
  summonPosition: Position;
  switchTurn: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  // setCanAttack,
  playerPosition,
  setPlayerPosition,
  enemyPosition,
  turn,
  SoundPlayer,
  summon,
  summonPosition,
  switchTurn,
}) => {
  const gridSize = 10; // Tamaño de la cuadrícula principal (10x10)
  const step = 5; // Tamaño del paso en vw
  const borderWidth = 10; // Ancho de la extensión en filas/columnas
  const offsetX = 10 / 1.2;
  const offsetY = 20 / 1.5;
  const [buttons, setButtons] = useState<Button[]>([]);
  const [playSound, setPlaySound] = useState(false);
  const {player} = usePlayerStore();
  const {creature} = useCreatureStore();

  // Generar botones al montar el componente
  useEffect(() => {
    const generatedButtons: Button[] = [];
    for (let x = -borderWidth; x < gridSize + borderWidth; x++) {
      for (let y = -borderWidth; y < gridSize + borderWidth; y++) {
        const type =
          x >= 0 && x < gridSize && y >= 0 && y < gridSize ? "main" : "border";
        generatedButtons.push({ x: x * step, y: y * step, type });
      }
    }
    setButtons(generatedButtons);
  }, []);

  const handleAction = (
    actionType: "attack" | "spell" | "move",
    additionalData?: any
  ) => {

    handleCombatAction(
      actionType,
      {
        playerPosition,
        setPlayerPosition,
        turn,
        switchTurn,
      },
      additionalData
    );

    setPlaySound(true);
    setTimeout(() => {
      setPlaySound(false);
    }, 300);
  };

  const isButtonHighlighted = (button: Button): boolean => {
    return (
      button.type === "main" &&
      Math.abs(button.x - playerPosition.x -offsetX) <= 3 * step &&
      Math.abs(button.y - playerPosition.y -offsetY) <= 3 * step
    );
  };


  return (
    <div className="gameBoard">
    <div className="containerGameBoard">
      {buttons.map((button, index) => (
        <div
          key={index}
          className={`bottomGB ${
            button.type === "border" ? "border" : "main"
          } ${isButtonHighlighted(button) ? "highlighted rpgui-cursor-point" : ""}`}
          style={{
            transform: `translate(${button.x}vw, ${button.y}vw)`,
          }}
          onClick={() => {
            if (button.type === "main" && isButtonHighlighted(button) && turn === "player") {
              handleAction("move", button);
            }
          }}
        />
      ))}
      <img
        src={player.classImg}
        alt="player"
        className="playerChar"
        style={{
          transform: `translate(${playerPosition.x}vw, ${playerPosition.y}vw) rotateX(-30deg) rotateZ(-45deg)`,
          pointerEvents: "none"
        }}
      />
      <img
        src={creature?.img}
        alt="Enemigo"
        className="enemy"
        style={{
          transform: `translate(${enemyPosition.x}vw, ${enemyPosition.y}vw) rotateX(-30deg) rotateZ(-45deg)`,
          pointerEvents: "none", 
        }}
      />
      {summon && (
        <img
          src={summon.img}
          alt="Summon"
          className="summon"
          style={{
            transform: `translate(${summonPosition.x}vw, ${summonPosition.y}vw) rotateX(-30deg) rotateZ(-45deg)`,
            pointerEvents: "none", // Ignorar clicks
          }}
        />
      )}
      {playSound && <SoundPlayer soundType="charStep" volume={1} />}
    </div>
    </div>
  );
};

export default GameBoard;
