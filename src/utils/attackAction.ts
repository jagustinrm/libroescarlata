import { getGlobalState } from "../customHooks/useGlobalState";
import { Position } from "../stores/types/others";
import { isAttackSuccessful } from "./calculateStats";
import { simulateAttackMovement } from "./simulateAttackMovement";

export default function AttackAction (
    adjustedDistance: any, 
    attacker:any, target:any,
    attackerPosition: Position,
    targetPosition: Position,
    setAttackerPosition: (position:Position) => void,
    setFloatingMessage: any,
    setActionMessages: any,
    healthFunction: any,
    nextTurn: () => void,
    damageIncrease?: number,
) {
    const {setSoundUrl} = getGlobalState();
    if (
        adjustedDistance <= Math.max(...attacker.attacks.map((a: any) => a.range))
      ) {
        const enemyAttackTimeout = setTimeout(() => {
          simulateAttackMovement(attackerPosition, 5, setAttackerPosition);
          const success = isAttackSuccessful(
            attacker.hitRatePercentage(), // Usar 0 si hitRatePercentage no está definido
            target.dodgePercentage(), // Usar 0 si dodgePercentage no está definido
          );
          if (success) {
            const { damage, damageMax } = attacker['attacks'][0];
            const rollDamage = Math.floor(Math.random() * (damageMax - damage + 1)) + damage;
            const redDamage = target.totalDmgReduction(attacker.level);
            const finalDamage = () => {
              if (!damageIncrease) { // Incremento de daño del player
                return Math.floor(rollDamage * (1 - redDamage / 100));
              } else {
                return rollDamage + Math.round((rollDamage * damageIncrease) / 100)
              }
            }

            healthFunction(Math.max(target.p_LeftHealth - finalDamage(), 0));
            setSoundUrl(attacker.attacks[0].soundEffect);
            setTimeout(() => {
              setSoundUrl('');
            }, 300);
            setActionMessages((prev: any) => [
              ...prev,
              `El enemigo te ha atacado con ${attacker['attacks'][0].name} y causó ${finalDamage()} puntos de daño.`,
            ]);
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
       