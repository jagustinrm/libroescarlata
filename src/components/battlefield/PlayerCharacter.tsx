import React from "react";
import { Player } from "../../stores/types/player";

interface PlayerProps {
    player: Player
    healthPercentage: number;
    xpPercentage: number;
    pet?: string | null;
}

const PlayerCharacter: React.FC<PlayerProps> = ({ player, healthPercentage, xpPercentage, pet }) => {
    return (
        <div className="PlayerChar">
            <div>
                <p>{player.name}</p>
                <p>🛡️ {player.classes}</p>
                <p>Nivel {player.level}</p>
            </div>
            {/* Barra de vida */}
            <div className="bars">
                <div className="health-bar-container">
                    <div className="health-bar" style={{ width: `${healthPercentage}%` }}></div>
                    <span className="health-text">{player.p_LeftHealth} / {player.p_MaxHealth}</span>
                </div>
                {/* Barra de experiencia */}
                <div className="experience-bar-container">
                    <div className="experience-bar" style={{ width: `${xpPercentage}%` }}></div>
                    <span className="experience-text">{player.playerExp} / {player.p_ExpToNextLevel}</span>
                </div>
            </div>
            {pet ? <p>Mascota: {pet}</p> : null}
        </div>
    );
};

export default PlayerCharacter;
