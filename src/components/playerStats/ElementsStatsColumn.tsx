import React, { useState, useEffect, useRef } from 'react';
import { getGlobalState } from '../../customHooks/useGlobalState';
import './ElementsStats.css'
interface ESProps {
  onClose: () => void;
}

export default function ElementsStatsColumn({ onClose }: ESProps) {

  const [position, setPosition] = useState({ x: 30, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const {player} = getGlobalState();
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
        className={`rpgui-content rpgui-container framed  quests-header ${dragging ? 'rpgui-cursor-grab-close' : 'rpgui-cursor-grab-open'} `}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <h1 style={{ margin: '0px' }}> Estadística de elementos</h1>
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
         <p>Puntos restantes:</p>
            <ul className="two-columns">
                {player.elementsStats?.map((e, index) => (
                    <li key={index}>
                        <span>{e.name}: </span><span>{e.amount}</span>
                    </li>
                ))}
            </ul>
    
        </div>
        

      </div>
    </div>
  );
}
