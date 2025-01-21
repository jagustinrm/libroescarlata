import React, { useState, useEffect, useRef } from 'react';
import './Quests.css';
import ButtonEdited from '../UI/ButtonEdited';
import { handleQuestReward } from '../handlers/handleRewards';
import useQuestStore from '../../stores/questStore';
import { QuestTree } from '../../stores/types/quests';

interface QuestsProps {
  onClose: () => void;
}

export default function Quests({ onClose }: QuestsProps) {
  const { questTree } = useQuestStore();
  const [position, setPosition] = useState({ x: 30, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [expandedMissions, setExpandedMissions] = useState<{ [key: string]: boolean }>({});
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        onClose(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const savedPosition = localStorage.getItem('questsPosition');
    if (savedPosition) {
      const parsedPosition = JSON.parse(savedPosition);
      setPosition(parsedPosition);
    }
  }, []);

  const handleMouseUp = () => {
    setDragging(false);
    localStorage.setItem('questsPosition', JSON.stringify(position));
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

  const onToggleMission = (key: string) => {
    setExpandedMissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderMission = (quest: any, key: string, category: keyof QuestTree) => {
    const isExpanded = expandedMissions[key];

    return (
      <li
      key={key}
      className={`rpgui-content rpgui-container framed-golden-2 ${isExpanded ? '' : 'rpgui-cursor-point'}`}
      >
        <label
          className="questName"
          onClick={() => onToggleMission(key)}
        >
          {quest.name}
        </label>
        {isExpanded && (
          <>
            <p>{quest.description}</p>
            {quest.objective && <p>Objetivo: {quest.objective}</p>}
            {quest.counter && (
              <p>
                Cantidad: {quest.progress}/{quest.counter}
              </p>
            )}
            <p>Recompensa: {quest.reward} materiales</p>
            {/* {quest.finished && <button>Obtener recompensa</button>} */}
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center'}}>
            <input
              className='rpgui-checkbox'
              type="checkbox"
              id={quest.name}
              checked={quest.finished}
              readOnly
            /> <label></label>
              {!quest.received && 
              <ButtonEdited
              label= {"Obtener"}
              width="130px"
              height="33px"
              disabled={!quest.finished}
              onClick={() => handleQuestReward(quest, category)}
            />
            }
              {/* <button className="rpgui-button">Obtener recompensa</button> */}
            </div>
          </>
        )}
      </li>
    );
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
      ref={componentRef} 
    >
      <div
        className={`quests-header ${dragging? 'rpgui-cursor-grab-close' : 'rpgui-cursor-grab-open' } `}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <h1>Misiones</h1>
        <button onClick={onClose} className="close-button">
          ❌
        </button>
      </div>
      <div className="questContainer">
        <div 
        className="quests-category "
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        >
          <h2>Misiones de historia</h2>
          <ul>
            {questTree.history?.map((quest, index) =>
              renderMission(quest, `history-${index}`, "history")
            )}
          </ul>
        </div>
        <div className="quests-category"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
        >
          <h2>Misiones secundarias</h2>
          <ul>
            {questTree.secondary?.map((quest, index) =>
              renderMission(quest, `secondary-${index}`, "secondary")
            )}
          </ul>
        </div>
        <div className="quests-category"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
        >
          <h2>Otras misiones</h2>
          <ul>
            {questTree.others && questTree.others.length > 0 ? (
              questTree.others?.map((quest, index) =>
                renderMission(quest, `others-${index}`, "others")
              )
            ) : (
              <p>No hay misiones en esta categoría.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
