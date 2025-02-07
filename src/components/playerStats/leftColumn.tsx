import usePlayerStore from '../../stores/playerStore';

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
        🔱 Daño: {player.damage()} - {player.damageMax()}
      </p>
      <p>
        {' '}
        Daño mágico: {player.mDamage()} - {player.mDamageMax()}
      </p>
      <p> 🛡️ Armadura: {player.totalArmorClass()}</p>
      <p> 🛡️ Armadura Mágica: {player.totalMArmor()}</p>
    </div>
  );
}
