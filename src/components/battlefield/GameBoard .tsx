import React, { useEffect, useState } from "react";
import "./GameBoard.css";
import { Creature } from "../../stores/types/creatures";
import { SoundPlayerProps } from "../UI/soundPlayer/SoundPlayer";
import { handleCombatAction } from "../../utils/combatHandlers";
import usePlayerStore from "../../stores/playerStore";
import useCreatureStore from "../../stores/creatures";
import { useWeaponStore } from "../../stores/weaponStore";

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
  selectedWeapon: string;
}

const GameBoard: React.FC<GameBoardProps> = ({
  playerPosition,
  setPlayerPosition,
  enemyPosition,
  turn,
  SoundPlayer,
  summon,
  summonPosition,
  switchTurn,
  selectedWeapon
}) => {
  const gridSize = 10; // Tamaño de la cuadrícula principal (10x10)
  const step = 5; // Tamaño del paso en vw
  const borderWidth = 10; // Ancho de la extensión en filas/columnas
  const offsetX = 10 / 1.2;
  const offsetY = 20 / 1.5;
  const [buttons, setButtons] = useState<Button[]>([]);
  const [playSound, setPlaySound] = useState(false);
  const { player } = usePlayerStore();
  const { creature } = useCreatureStore();
  const { weapons } = useWeaponStore();
  const weaponFiltered = weapons?.find((w) => w.name === selectedWeapon);
  const weaponRange = weaponFiltered?.range || 5; // Rango del arma seleccionada
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
      Math.abs(button.x - playerPosition.x - offsetX) <= 3 * step &&
      Math.abs(button.y - playerPosition.y - offsetY) <= 3 * step
    );
  };

  const isButtonPlayerPosition = (button: Button): boolean => {
    const tolerance = 2; // Ajusta según el nivel de precisión necesario
    return (
      button.type === "main" &&
      Math.abs(button.x - playerPosition.x - offsetX) <= tolerance &&
      Math.abs(button.y - playerPosition.y - offsetY) <= tolerance
    );
  };
  
  const isButtonEnemyPosition = (button: Button): boolean => {
    const tolerance = 2; // Ajusta según el nivel de precisión necesario
    return (
      button.type === "main" &&
      Math.abs(button.x - enemyPosition.x- offsetX) <= tolerance &&
      Math.abs(button.y - enemyPosition.y - offsetY) <= tolerance
    );
  };
  const isButtonInAttackRange = (button: Button): boolean => {
    if (!weaponFiltered) return false; // Sin arma, no hay rango

    const dx = Math.floor(Math.abs(button.x - playerPosition.x - offsetX));
    const dy = Math.floor(Math.abs(button.y - playerPosition.y - offsetY));

    // Ignorar el casillero central del jugador
    if (dx === 0 && dy === 0) return false;
    
    // Factor de penalización para diagonales
    const diagonalPenalty = 1; // Ajusta según la reducción deseada
    const adjustedDistance = dx + dy - Math.min(dx, dy) * (1 - diagonalPenalty);

    return button.type === "main" && adjustedDistance <= weaponRange;
};


  return (
    <div className="gameBoard">
      <div className="containerGameBoard">
        {buttons.map((button, index) => (
          <div
            key={index}
            className={`bottomGB ${
              button.type === "border" ? "border" : "main"
            } 
            ${isButtonPlayerPosition(button) ? "player-position" : ""} 
            ${isButtonEnemyPosition(button) ? "enemy-position" : ""} 
            ${isButtonHighlighted(button) ? "highlighted rpgui-cursor-point" : ""}
            ${isButtonInAttackRange(button) ? "attack-range" : ""}
            `}
            style={{
              transform: `translate(${button.x}vw, ${button.y}vw)`,
            }}
            onClick={() => {
              if (
                button.type === "main" &&
                isButtonHighlighted(button) &&
                turn === "player"
              ) {
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
            pointerEvents: "none",
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
              pointerEvents: "none",
            }}
          />
        )}
        {playSound && <SoundPlayer soundType="charStep" volume={1} />}
      </div>
    </div>
  );
};

export default GameBoard;
