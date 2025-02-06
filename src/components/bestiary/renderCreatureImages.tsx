import { Creature } from "../../stores/types/creatures";
import { Player } from "../../stores/types/player";
interface ed 
    { count: number; 
        name: string; 
    }

export const renderCreatureImages = (currentMonsters: Creature[], 
    handleBattle: (enemy: string) => void, player: Player) => (
    <div className="bestiaryGrid">
      {currentMonsters.map((c) => {
        const isDefeated = player.enemiesDeleted?.some(
          (ed: ed) => ed.name === c.name,
        );
        const cant = player.enemiesDeleted.find(
          (ed: ed) => ed.name === c.name,
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