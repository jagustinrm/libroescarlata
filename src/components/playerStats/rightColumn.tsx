import usePlayerStore from '../../stores/playerStore';

export default function RightColumnPStats() {
  const { player } = usePlayerStore();
  return (
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
      <p>Esquiva: {player.totalDodge().toFixed(2)} </p>
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
  );
}
