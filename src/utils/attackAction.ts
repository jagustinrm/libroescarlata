
import { getGlobalState } from "../customHooks/useGlobalState";
import usePlayerStore from "../stores/playerStore";
import { Position } from "../stores/types/others";
import { isAttackSuccessful, calculateTotalHitRate, calculateHitRatePercentage, calculateTotalDodge, calculateDodgePercentage, calculateTotalArmor, calculateDmgReduction } from "./calculateStats";
import { simulateAttackMovement } from "./simulateAttackMovement";

export default function AttackAction(
  adjustedDistance: any,
  attacker: any, target: any,
  attackerPosition: Position,
  targetPosition: Position,
  setAttackerPosition: (position: Position) => void,
  setFloatingMessage: any,
  setActionMessages: any,
  healthFunction: any,
  nextTurn: () => void,
  damageIncrease?: number,
) {
  const { setSoundUrl } = getGlobalState();
  const { playerActions } = usePlayerStore.getState();
  if (
    adjustedDistance <= Math.max(...attacker.attacks.map((a: any) => a.range))
  ) {
    const enemyAttackTimeout = setTimeout(() => {
      simulateAttackMovement(attackerPosition, 5, setAttackerPosition);
      const attackerHitRate = attacker.stats
        ? calculateTotalHitRate(attacker.stats.dex, attacker.hitRate)
        : attacker.hitRate;
      const hitRatePct = calculateHitRatePercentage(attackerHitRate, target.level);

      const targetDodge = target.stats
        ? calculateTotalDodge(target.stats.agi, target.dodge)
        : target.dodge;
      const dodgePct = calculateDodgePercentage(targetDodge, attacker.level);

      const success = isAttackSuccessful(hitRatePct, dodgePct);
      if (success) {
        const { damage, damageMax } = attacker['attacks'][0];
        const rollDamage = Math.floor(Math.random() * (damageMax - damage + 1)) + damage;

        const targetArmor = target.stats
          ? calculateTotalArmor(target.bodyParts, target.stats.con, target.level)
          : target.armorClass;
        const redDamage = calculateDmgReduction(targetArmor, attacker.level);
        const finalDamage = () => {
          if (!damageIncrease) { // Incremento de daño del player
            return Math.floor(rollDamage * (1 - redDamage / 100));
          } else {
            return rollDamage + Math.round((rollDamage * damageIncrease) / 100)
          }
        }

        healthFunction(Math.max(target.c_LeftHealth - finalDamage(), 0));
        setSoundUrl(attacker.attacks[0].soundEffect);
        setTimeout(() => {
          setSoundUrl('');
        }, 300);
        setActionMessages((prev: any) => [
          ...prev,
          `El enemigo te ha atacado con ${attacker['attacks'][0].name} y causó ${finalDamage()} puntos de daño.`,
        ]);

        attacker['attacks'][0].condition && playerActions.updateC_Conditions(attacker['attacks'][0].condition)

        setFloatingMessage({
          message: finalDamage().toString(),
          onComplete: () => setFloatingMessage(null),
          textColor: 'red',
          position: targetPosition,
        });
      } else {
        setSoundUrl('/music/attacks/weapon-swing.wav');
        setTimeout(() => {
          setSoundUrl('');
        }, 300);
        setFloatingMessage({
          message: '¡Falló!',
          onComplete: () => setFloatingMessage(null),
          textColor: 'red',
          position: targetPosition,
        });
        setActionMessages((prev: any) => [...prev, `¡${attacker.name} falló!`]);
      }

      nextTurn();
    }, 1000);

    return () => clearTimeout(enemyAttackTimeout);
  } else {
    nextTurn();
  }
}
