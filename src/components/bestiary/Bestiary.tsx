import { useMemo, useState } from 'react';
import useGlobalState from '../../customHooks/useGlobalState';
import BackButton from '../UI/BackButton';
import './Bestiary.css';
import ButtonEdited from '../UI/ButtonEdited';
import { useNavigate } from 'react-router-dom';
import { renderCreatureImages } from './renderCreatureImages';

export default function Bestiary() {
  const { creatures, bosses, player, setFightType } = useGlobalState();
  const [monsterCategory, setMonsterCategory] = useState('creatures');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const creaturesPerPage = 8;
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
  // Calcular los índices de inicio y fin para la página actual
  const indexOfLastCreature = currentPage * creaturesPerPage;
  const indexOfFirstCreature = indexOfLastCreature - creaturesPerPage;

  const currentMonsters = useMemo(() => {
    if (monsterCategory === 'creatures') {
      return creatures.slice(indexOfFirstCreature, indexOfLastCreature);
    } else if (monsterCategory === 'bosses') {
      return bosses.slice(indexOfFirstCreature, indexOfLastCreature);
    }
    return [];
  }, [monsterCategory, creatures, bosses, currentPage]);

  // Número total de páginas
  const totalPages = Math.ceil(creatures.length / creaturesPerPage);
  const handleBattle = (enemy: string) => {
    setFightType('normal')
    navigate('/fightScene', {
      state: {
        enemy: enemy,
      },
    });
  };

  return (
    <div className="bestiaryContainer rpgui-container framed-golden-2">
      <div style={{ display: 'flex' }}>
        <ButtonEdited
          label="Normal"
          width="130px"
          height="33px"
          onClick={() => setMonsterCategory('creatures')}
        />
        <ButtonEdited
          label="Jefes"
          width="130px"
          height="33px"
          onClick={() => setMonsterCategory('bosses')}
        />
      </div>
      {renderCreatureImages(currentMonsters, handleBattle, player)}

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
