import { useMemo, useState } from 'react';
import useGlobalState from '../../customHooks/useGlobalState';
import BackButton from '../UI/BackButton';
import './Bestiary.css';
import ButtonEdited from '../UI/ButtonEdited';
import { useNavigate } from 'react-router-dom';

export default function Bestiary() {
  const { creatures, bosses, player } = useGlobalState();
  const [monsterCategory, setMonsterCategory] = useState("creatures")
  const navigate = useNavigate();
  // Estado para la página actual
  const [currentPage, setCurrentPage] = useState(1);
  const creaturesPerPage = 8;

  // Calcular los índices de inicio y fin para la página actual
  const indexOfLastCreature = currentPage * creaturesPerPage;
  const indexOfFirstCreature = indexOfLastCreature - creaturesPerPage;

 
  const currentMonsters = useMemo(() => {
    if (monsterCategory === "creatures") {
      return creatures.slice(indexOfFirstCreature, indexOfLastCreature);
    } else if (monsterCategory === "bosses") {
      return bosses.slice(indexOfFirstCreature, indexOfLastCreature);
    }
    return [];
  }, [monsterCategory, creatures, bosses, currentPage]);

  // Número total de páginas
  const totalPages = Math.ceil(creatures.length / creaturesPerPage);

  // Cambiar de página
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBattle = (enemy: string) => {
    navigate('/fightScene', {
      state: {
        enemy: enemy,
        fightType: 'normal',
      },
    });
  };

  const renderCreatureImages = () => (
    <div className="bestiaryGrid">
      {currentMonsters.map((c) => {
        const isDefeated = player.enemiesDeleted?.some(
          (ed) => ed.name === c.name,
        );
        const cant = player.enemiesDeleted.find(
          (ed) => ed.name === c.name,
        )?.count;
        return (
          <div
            key={c.name}
            className="creatureCard  rpgui-cursor-point"
            onClick={() => (isDefeated ? handleBattle(c.name) : null)}
          >
            <img
              className="creatureImgCard"
              style={{ filter: isDefeated ? 'brightness(1)' : 'brightness(0)' }}
              src={c.img}
              alt={c.name}
            />
            <p
              style={{ display: isDefeated ? 'auto' : 'none' }}
              className="creatureName"
            >
              {c.name}
            </p>
            <p
              style={{ display: isDefeated ? 'auto' : 'none' }}
              className="creatureName"
            >
              Cantidad: {cant}
            </p>
          </div>
        );
      })}
    </div>
  );
  return (
    <div className="bestiaryContainer rpgui-container framed-golden-2">
      <div style={{display: 'flex'}}>
      <ButtonEdited
            label="Normal"
            width="130px"
            height="33px"
            onClick={() => setMonsterCategory("creatures")}
          />
      <ButtonEdited
            label="Jefes"
            width="130px"
            height="33px"
            onClick={() => setMonsterCategory("bosses")}
      />
      </div>
      {renderCreatureImages()}

      <div className="pagination">
        <div style={{ marginTop: '5px' }}>
          <ButtonEdited
            label="Anterior"
            width="130px"
            height="33px"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          />
        </div>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <div style={{ marginTop: '5px' }}>
          <ButtonEdited
            label="Siguiente"
            width="130px"
            height="33px"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          />
        </div>
      </div>

      <BackButton />
    </div>
  );
}
