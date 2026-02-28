import usePlayerStore from '../../stores/playerStore';
import { calculateTotalDodge, calculateTotalHitRate, calculateDodgePercentage, calculateHitRatePercentage, calculateDmgReduction, calculateDmgMReduction, calculateSummonDmgIncrease, calculateTotalRes } from '../../utils/calculateStats';

export default function RightColumnPStats() {
  const { player } = usePlayerStore();
  const totalDodge = calculateTotalDodge(player.stats.agi, player.dodge);
  const totalHitRate = calculateTotalHitRate(player.stats.dex, player.hitRate);
  console.log(calculateTotalRes(player.controlResist, player.stats));
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
      <p>Esquiva: {totalDodge.toFixed(2)} </p>
      <p>Puntería: {totalHitRate} </p>
      <p>Porcentaje de esquiva: {calculateDodgePercentage(totalDodge)}% </p>
      <p>Porcentaje de puntería: {calculateHitRatePercentage(totalHitRate, player.level)}% </p>
      <p>Reducción de daño: {calculateDmgReduction(player.bodyParts.pecho?.armorValue || 0, player.level)}%</p>
      <p>Regeneración de vida: {1} </p>
      <p>
        Reducción de daño mágico: {calculateDmgMReduction(player.bodyParts.pecho?.mArmorValue || 0, player.level)}%
      </p>
      <p>Aumento de daño de invocación: {calculateSummonDmgIncrease(player.stats.cha)}%</p>
      <p>
        🐾 Mascotas:
        <ul>
          {player.petsName?.map((petName, index) => (
            <li key={index}>{petName}</li>
          ))}
        </ul>
      </p>
      <div>
        <p>Resistencia mágica: </p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {calculateTotalRes(player.controlResist, player.stats).map(r => {
            return <span key={r.name}>{r.name} : {r.value}</span>
          })}
        </div>
      </div>
    </div>
  );
}
