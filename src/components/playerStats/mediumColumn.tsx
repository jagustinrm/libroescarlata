import { useState } from 'react';
import { calculateSummonDmgIncrease } from '../../utils/calculateStats';
import useStatManagement from '../../customHooks/useStatManagement';
import usePlayerStore from '../../stores/playerStore';
import { Stats } from '../../stores/types/stats';
import BackButton from '../UI/BackButton';
import ButtonEdited from '../UI/ButtonEdited';
import ElementsStatsColumn from './ElementsStatsColumn';

export default function MediumColumnPStats() {
  const { handleIncreaseStat } = useStatManagement();
  const { player } = usePlayerStore();
  const [eStatsView, setEStatsView] = useState(false);
  const toggleEStats = () => {
    setEStatsView(!eStatsView)
  }

  return (
    <div className="mediumColumnStats">
      <ButtonEdited
        label="Elementos"
        width="130px"
        height="33px"
        onClick={() => toggleEStats()}
      />
      <div className="statsAndAdd">
        <ul className="statsPoints">
          {/* **************************************** ESTADÍSTICAS ************************************ */}
          {player.stats &&
            Object.entries(player.stats).map(([key, value]) => (
              <div className="statsAndAdd">
                <li key={key}>
                  {key}: {value}
                </li>
                {player.leftPoints ? (
                  <button
                    className="medieval-button"
                    onClick={() => handleIncreaseStat(key as keyof Stats, 1)}
                  >
                    +
                  </button>
                ) : (
                  <></>
                )}
              </div>
            ))}
        </ul>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: ' center',
            gap: '0px',
          }}
        >
          <p> Restan:</p>
          <div style={{ position: 'relative' }}>
            <p> {player.leftPoints}</p>
            {player.leftPoints ? (
              <img
                className="exclamationMark playerStats"
                src="./img/UI/exclamation-mark.png"
                alt="Signo de exclamación"
              />
            ) : null}
          </div>
        </div>
        {/* <ul className="statsPoints"></ul> */}
      </div>

      {player.selectedPet && (
        <div className="PetDescription rpgui-container framed-grey bars">
          <div>
            <p>Mascota: {player.selectedPet.name}</p>
            <img
              className="imgPet"
              src={player.selectedPet.img}
              alt={player.selectedPet.name}
            />
          </div>
          <div className="PetStats">
            <p className="petPara">Tipo: {player.selectedPet.type}</p>
            <p className="petPara">
              Dados de golpe: {player.selectedPet.hitPoints}{' '}
            </p>
            <p className="petPara">
              Clase de armadura: {player.selectedPet.armorClass}{' '}
            </p>
            <p className="petPara">Daño:</p>
            <p className="petPara">
              {' '}
              {player.selectedPet.attacks[0].damage} (+
              {(player.selectedPet.attacks[0].damage *
                calculateSummonDmgIncrease(player.stats.cha)) /
                100}
              ) -{player.selectedPet.attacks[0].damageMax} (+
              {(player.selectedPet.attacks[0].damageMax *
                calculateSummonDmgIncrease(player.stats.cha)) /
                100}
              )
            </p>
          </div>
        </div>
      )}
      <BackButton />
      {eStatsView && <ElementsStatsColumn onClose={toggleEStats} />}
    </div>
  );
}
