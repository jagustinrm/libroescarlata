import React, { useState, useEffect } from "react";
import "./Quests.css";
import { useLoadQuests } from "../../customHooks/useLoadQuests";

interface QuestsProps {
  onClose: () => void;
}

export default function Quests({ onClose }: QuestsProps) {
  const { quests } = useLoadQuests();
  const [position, setPosition] = useState({ x: 30, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  // Load position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem("questsPosition");
    if (savedPosition) {
      const parsedPosition = JSON.parse(savedPosition);
      setPosition(parsedPosition);
    }
  }, []);

  // Save position to localStorage on drag end
  const handleMouseUp = () => {
    setDragging(false);
    localStorage.setItem("questsPosition", JSON.stringify(position));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  return (
    <div
      className="quests-window"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="quests-header"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <h1 >Misiones</h1>
        <button onClick={onClose} className="close-button">
          ❌
        </button>
      </div>
      <div className="questContainer">
        {/* Misiones de historia */}
        <div className="quests-category ">
          <h2>Misiones de historia</h2>
          <ul>
            {quests?.questTree.history.map((quest, index) => (
              <li key={index} className="rpgui-container framed-golden-2">
                <label className="questName">{quest.name}</label>
                <p>{quest.description}</p>
                <p>Objetivo: {quest.objective}</p>
                <p>
                  Cantidad: {quest.progress}/{quest.counter}
                </p>
                <p>Recompensa: {quest.reward} materiales</p>
                {quest.finished && <button>Obtener recompensa</button>}
                <input
                  type="checkbox"
                  id={quest.name}
                  checked={quest.finished}
                  readOnly
                />
                {quest.finished && <button className="rpgui-button">Obtener recompensa</button>}
                
              </li>
            ))}
          </ul>
        </div>

        {/* Misiones secundarias */}
        <div className="quests-category">
          <h2>Misiones secundarias</h2>
          <ul>
            {quests?.questTree.secondary.map((quest, index) => (
              <li key={index} className="rpgui-container framed-golden-2">
                <label className="questName">{quest.name}</label>
                <p>{quest.description}</p>
                <p>Objetivo: {quest.objective}</p>
                <p>
                  Cantidad: {quest.progress}/{quest.counter}
                </p>
                <p>Recompensa: {quest.reward} materiales</p>
                <div className="completedQuest">
                  <label>Completado: </label>
                  <input
                    type="checkbox"
                    id={quest.name}
                    checked={quest.finished}
                    readOnly
                  />
                  {quest.finished && <button className="rpgui-button">Obtener recompensa</button>}

                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Otras misiones */}
        <div className="quests-category">
          <h2>Otras misiones</h2>
          <ul>
            {quests?.questTree.others && quests?.questTree.others.length > 0 ? (
              quests.questTree.others.map((quest, index) => (
                <li key={index} className="rpgui-container framed-golden-2">
                  <label className="questName">{quest.name}</label>
                  <p>{quest.description}</p>
                  <p>Objetivo: {quest.objective}</p>
                  <p>Recompensa: {quest.reward} materiales</p>
                  <p>
                    Cantidad: {quest.progress}/{quest.counter}
                  </p>
                  <input
                    type="checkbox"
                    id={quest.name}
                    checked={quest.finished}
                    readOnly
                  />
                  {quest.finished && <button className="rpgui-button">Obtener recompensa</button>}
                
                </li>
              ))
            ) : (
              <p>No hay misiones en esta categoría.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
