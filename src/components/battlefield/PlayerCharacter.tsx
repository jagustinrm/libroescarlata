import React from 'react';
import { Player } from '../../stores/types/player';
import { Pet } from '../../stores/types/pets';

interface PlayerProps {
  player: Player;
  healthPercentage: number;
  xpPercentage: number;
  pet?: Pet | null;
  manaPercentage: number;
}

const PlayerCharacter: React.FC<PlayerProps> = ({
  player,
  healthPercentage,
  xpPercentage,
  pet,
  manaPercentage,
}) => {
  return (
    <div>
      <div className=" rpgui-container framed PlayerChar fixedUI ">
        <img className="playerAvatar" src={player.avatarImg} alt="avatar img" />
        <div className="charFightSceneDescription">
          <p>{player.name}</p>
          <p>🛡️ {player.classes}</p>
          <p>Nivel {player.level}</p>
        </div>
        <div className="rpgui-container framed-grey bars">
          {/* Barra de vida */}
          <div className="heal-bar-container-text">
            <div className="health-bar-container">
              <div
                className="health-bar"
                style={{ width: `${healthPercentage}%` }}
              ></div>
            </div>
            <div>
              <p className="health-text">
                {player.p_LeftHealth} / {player.totalMaxHealth()}
              </p>
            </div>
          </div>
          {/* Barra de maná */}
          <div className="heal-bar-container-text">
            <div className="mana-bar-container">
              <div
                className="mana-bar"
                style={{ width: `${manaPercentage}%` }}
              ></div>
            </div>
            <div>
              <p className="mana-text">
                {player.p_LeftMana} / {player.totalMaxMana()}
              </p>
            </div>
          </div>
          {/* Barra de experiencia */}
          <div className="heal-bar-container-text">
            <div className="experience-bar-container">
              <div
                className="experience-bar"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
            <div style={{overflow: 'hidden'}}>
              <p className="experience-text">
                {player.playerExp} / {player.p_ExpToNextLevel}
              </p>
            </div>
          </div>
        </div>
        {pet && <img className="imgPet" src={pet.img} alt="" />}

        {pet ? <p>Mascota: {pet.name}</p> : null}
      </div>
      {/* <div className="blackBar"></div> */}
    </div>
  );
};

export default PlayerCharacter;
