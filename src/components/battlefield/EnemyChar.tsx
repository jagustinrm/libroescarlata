import React from 'react';
import { Creature } from '../../stores/types/creatures'; // Ajusta la ruta según tu proyecto

interface EnemyCharProps {
  creature: Creature | null;
}

const EnemyChar: React.FC<EnemyCharProps> = ({ creature }) => {

  return (
    <div className="rpgui-container framed EnemyChar fixedUI ">
      {creature?.role === 'boss' && <h1 className="bossSign">BOSS</h1>}
      {creature ? (
        <div>
          <h3>{creature.name}</h3>
          <p>Nivel: {creature.level}</p>
          <p>Vida: {creature.c_LeftHealth}</p>
          {creature.c_Conditions.length > 0 && 
          <div>
            <p>Estado: </p>
            {creature.c_Conditions.map(c => {
              return <p>{c.name}: {c.duration}</p>;
            })}
          </div>

          
          }
        </div> 
      ) : (
        <p>No hay enemigo seleccionado.</p>
      )}
    </div>
  );
};

export default EnemyChar;
