import './PlayerStats.css';
import usePlayerStore from '../../stores/playerStore';
import { useNavigate } from 'react-router-dom';
import { Stats } from '../../stores/types/stats';
import useStatManagement from '../../customHooks/useStatManagement';

export default function PlayerStats() {
  const { player } = usePlayerStore();
  const navigate = useNavigate();
  const { handleIncreaseStat } = useStatManagement();

  console.log(player);
  return (
    <section className="sectionPlayer rpgui-container framed-golden-2">
      <div className="container containerPlayer ">
        <div className="player">
          <div className="stats">
            <img
              className="playerAvatar"
              src={player.avatarImg}
              alt="avatar img"
            />
            <p>👤 {player.name}</p>
            <p>🛡️ {player.classes}</p>
            <p>⭐ Nivel: {player.level}</p>
            <div className="p_leaftHealth">
              <div className="heart">❤️</div>
              <p>
                {' '}
                Vida: {player.p_LeftHealth} / {player.p_MaxHealth}
              </p>
            </div>
            <p>
              🌀 Espíritu: {player.p_LeftMana} / {player.p_MaxMana}
            </p>
            <p>
              ✨ Exp: {player.playerExp} / {player.p_ExpToNextLevel}
            </p>
            <p>🛠️ Materiales: {player.playerMaterial}</p>
            <p>
              🗡️ Arma actual:{' '}
              {player.selectedWeapon?.name || 'Sin arma equipada'}
            </p>
            <p>
              {' '}
              🛡️ Armadura actual:{' '}
              {player.selectedArmor?.name +
                ' ' +
                player.selectedArmor?.material || 'Sin arma equipada'}
            </p>
            <p> 🛡️ Clase de armadura: {player.totalArmorClass()}</p>
            <p>⚔️ Ataque Base: {player.baseAttackBonus}</p>
          </div>
          <button
            className="rpgui-button playerbackbutton"
            onClick={() => navigate('/home')}
          >
            Volver
          </button>
        </div>
        <div className="mediumColumnStats">
          <div className="statsAndAdd">
            <ul className="statsPoints">
              {/* **************************************** ESTADÍSTICAS ************************************ */}
              {player.stats &&
                Object.entries(player.stats).map(([key, value]) => (
                  <div className="statsAndAdd">
                    <li key={key}>
                      {key}: {value} +{' '}
                      {player.statsIncrease[key as keyof Stats]}
                    </li>
                    {player.leftPoints ? (
                      <button
                        className="medieval-button"
                        onClick={() =>
                          handleIncreaseStat(key as keyof Stats, 1)
                        }
                      >
                        +
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
            </ul>
            <ul className="statsPoints"></ul>
          </div>
          <p> Puntos restantes: {player.leftPoints}</p>

          {player.selectedPet && (
            <div className="PetDescription rpgui-container framed-grey bars">
              <p>Mascota: {player.selectedPet.name}</p>
              <img
                className="imgPet"
                src={player.selectedPet.img}
                alt={player.selectedPet.name}
              />
              <div className="PetStats">
                <p className="petPara">Tipo: {player.selectedPet.type}</p>
                <p className="petPara">
                  Dados de golpe: {player.selectedPet.hitPoints}{' '}
                </p>
                <p className="petPara">
                  Clase de armadura: {player.selectedPet.armorClass}{' '}
                </p>
                <p className="petPara">Ataque:</p>
                <p className="petPara"> {player.selectedPet.attack.melee}</p>
              </div>
            </div>
          )}
        </div>
        {/* **************************************** ESTADÍSTICAS ************************************ */}

        {/* Nuevo div con más información */}
        <div className="additional-stats">
          <p>🎲 Dados de golpe: {player.hitDie}</p>
          <p>
            🔮 Aptitudes:
            <ul>
              {player.classFeatures?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </p>
          <p>
            💪 Tiradas de salvación:
            <ul>
              {Object.entries(player.saves).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </p>

          <p>
            🐾 Mascotas:
            <ul>
              {player.petsName?.map((petName, index) => (
                <li key={index}>{petName}</li>
              ))}
            </ul>
          </p>
        </div>
      </div>
    </section>
  );
}
