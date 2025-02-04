import './PlayerStats.css';
import usePlayerStore from '../../stores/playerStore';
import { Stats } from '../../stores/types/stats';
import useStatManagement from '../../customHooks/useStatManagement';
import BackButton from '../UI/BackButton';
import { useAnimateExclamationMark } from '../../utils/animateExclamationMark';

export default function PlayerStats() {
  const { player } = usePlayerStore();
  useAnimateExclamationMark()
  const { handleIncreaseStat } = useStatManagement();
  return (
    <section className="sectionPlayer rpgui-container framed-golden-2">
      <div className="container containerPlayer ">
        <div className="player">
          <div className="stats">
            <img
              className="playerAvatar statsAvatar"
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
                Vida: {player.p_LeftHealth} / {player.totalMaxHealth()}
              </p>
            </div>
            <p>
              🌀 Espíritu: {player.p_LeftMana} / {player.totalMaxMana()}
            </p>
            <p>
              ✨ Exp: {player.playerExp} / {player.p_ExpToNextLevel}
            </p>
            <p>🛠️ Materiales: {player.playerMaterial}</p>
            <p>
              🗡️ Arma actual:{' '}
              {player.bodyParts.manoDerecha?.name || 'Sin arma equipada'}
            </p>
            <p>🔱 Daño: {player.damage()} - {player.damageMax()}</p>
            <p> Daño mágico: {player.mDamage()} - {player.mDamageMax()}</p>
            <p> 🛡️ Armadura: {player.totalArmorClass()}</p>
            <p> 🛡️ Armadura Mágica: {player.totalMArmor()}</p>
          </div>
         
        </div>
        <div className="mediumColumnStats">
          <div className="statsAndAdd">
            <ul className="statsPoints">
              {/* **************************************** ESTADÍSTICAS ************************************ */}
              {player.stats &&
                Object.entries(player.stats).map(([key, value]) => (
                  <div className="statsAndAdd">
                    <li key={key}>
                      {key}: {value}
                      {/* {player.statsIncrease[key as keyof Stats]} */}
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
            <div style={{display: 'flex', flexDirection: 'column', alignItems:' center', gap: '0px'}}>
            <p> Restan:</p>
            <div style={{position: 'relative'}}>
            <p> {player.leftPoints}</p>
            { player.leftPoints ? <img className='exclamationMark' style={{left: '0px', width: '20px', top: '5px'}} src="./img/UI/exclamation-mark.png" alt="Signo de exclamación" /> : null }
            
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
                <p className="petPara"> {
                player.selectedPet.attacks[0].damage}  (+{ player.selectedPet.attacks[0].damage * player.summonDmgIncrease() / 100})
                -
                {player.selectedPet.attacks[0].damageMax} (+{ player.selectedPet.attacks[0].damageMax * player.summonDmgIncrease() / 100})
                </p>
              </div>
            </div>
          )}
             <BackButton/>
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
          <p>Esquiva: {player.totalDodge()} </p>
          <p>Puntería: {player.totalHitRate()} </p>
          <p>Porcentaje de esquiva: {player.dodgePercentage()}% </p>
          <p>Porcentaje de puntería: {player.hitRatePercentage()}% </p>
          <p>Reducción de daño: {player.totalDmgReduction(player.level)}%</p>
          <p>
            Reducción de daño mágico: {player.totalDmgMReduction(player.level)}%
          </p>
          <p>Aumento de daño de invocación: {player.summonDmgIncrease()}%</p>
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
