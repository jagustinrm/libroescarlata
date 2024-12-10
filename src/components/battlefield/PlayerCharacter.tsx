import React from "react";
import { Player } from "../../stores/types/player";

interface PlayerProps {
    player: Player
    healthPercentage: number;
    xpPercentage: number;
    pet?: string | null;
    manaPercentage: number;
}

const PlayerCharacter: React.FC<PlayerProps> = ({ player, healthPercentage, xpPercentage, pet, manaPercentage }) => {
    return (
        <div>
            <div className=" rpgui-container framed PlayerChar">
                <img className='playerAvatar' src={player.avatarImg} alt="avatar img" />
                <div className="charFightSceneDescription">
                    <p>{player.name}</p>
                    <p>🛡️ {player.classes}</p>
                    <p>Nivel {player.level}</p>
                </div>
                <div className="rpgui-container framed-grey bars">
                    {/* Barra de vida */}
                    <div className="heal-bar-container-text">
                        <div className="health-bar-container">
                            <div className="health-bar" style={{ width: `${healthPercentage}%` }}></div>
                        </div>
                        <div>
                            <p className="health-text">{player.p_LeftHealth} / {player.p_MaxHealth}</p>
                        </div>
                    </div>
                    {/* Barra de maná */}
                    <div className="heal-bar-container-text">
                        <div className="mana-bar-container">
                            <div className="mana-bar" style={{ width: `${manaPercentage}%` }}></div>
                        </div>
                        <div>
                            <p className="mana-text">{player.p_LeftMana} / {player.p_MaxMana}</p>
                        </div>
                    </div>
                    {/* Barra de experiencia */}
                    <div className="heal-bar-container-text">
                        <div className="experience-bar-container">
                            <div className="experience-bar" style={{ width: `${xpPercentage}%` }}></div>
                        </div>
                    <div>
                    <p className="experience-text">{player.playerExp} / {player.p_ExpToNextLevel}</p>
                    </div>
                    </div>
                </div>
                {pet ? <p>Mascota: {pet}</p> : null}
            </div>
            <div className="blackBar"></div>
        </div>
    );
};

export default PlayerCharacter;
