import usePlayerStore from '../../stores/playerStore';
import { calculateTotalMaxHealth, calculateTotalMaxMana, calculateTotalDamage, calculateTotalMaxDamage, calculateMTotalDamage, calculateMTotalMaxDamage, calculateTotalArmor, calculateTotalMArmor } from '../../utils/calculateStats';

export default function LeftColumnPStats() {
  const { player } = usePlayerStore();
  return (
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
          Vida: {player.c_LeftHealth} / {calculateTotalMaxHealth(player.stats.con, player.stats.cha, player.c_MaxHealth)}
        </p>
      </div>
      <p>
        🌀 Espíritu: {player.c_LeftMana} / {calculateTotalMaxMana(player.stats.int, player.stats.cha, player.c_MaxMana)}
      </p>
      <p>
        ✨ Exp: {player.playerExp} / {player.p_ExpToNextLevel}
      </p>
      <p>🛠️ Materiales: {player.playerMaterial}</p>
      <p>
        🔱 Daño: {calculateTotalDamage(player.bodyParts, player.stats.str, player.buffs.str?.value)} - {calculateTotalMaxDamage(player.bodyParts, player.stats.str, player.buffs.str?.value)}
      </p>
      <p>
        {' '}
        Daño mágico: {calculateMTotalDamage(player.bodyParts, player.stats.int, player.buffs.int?.value)} - {calculateMTotalMaxDamage(player.bodyParts, player.stats.int, player.buffs.int?.value)}
      </p>
      <p> 🛡️ Armadura: {calculateTotalArmor(player.bodyParts, player.stats.con, player.level)}</p>
      <p> 🛡️ Armadura Mágica: {calculateTotalMArmor(player.bodyParts, player.stats.int, player.level)}</p>
    </div >
  );
}
