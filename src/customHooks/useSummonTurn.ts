import { useEffect } from 'react';
import { rollDice } from '../utils/rollDice.ts';
// import { CreatureInterface } from '../components/interfaces/CreatureInterface.ts';
import { Creature } from '../stores/types/creatures.ts';

interface Position {
    x: number;
    y: number;
}

interface SummonTurnProps {
    creature: Creature | null;
    summon: Creature | null;
    turn: string;
    player: { p_LeftHealth: number, armorClass: number };
    setCreatureHealth: (health: number) => void
    setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
    switchTurn: () => void;
    enemyPosition: Position;
    summonPosition: Position;
    setSummonPosition: React.Dispatch<React.SetStateAction<Position>>;
}

export const useSummonTurn = ({
    creature,
    turn,
    player,
    setActionMessages,
    switchTurn,
    enemyPosition,
    summonPosition,
    setSummonPosition,
    summon,
    setCreatureHealth
}: SummonTurnProps) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (turn === "summon" && creature && creature.health && creature.health > 0 && player.p_LeftHealth > 0) {
                const deltaX = enemyPosition.x - summonPosition.x;
                const deltaY = enemyPosition.y - summonPosition.y;

                const stepSize = 5;

                const newX =
                    Math.abs(deltaX) > stepSize
                        ? summonPosition.x + (deltaX > 0 ? stepSize : -stepSize)
                        : summonPosition.x;

                const newY =
                    Math.abs(deltaY) > stepSize
                        ? summonPosition.y + (deltaY > 0 ? stepSize : -stepSize)
                        : summonPosition.y;
                    setSummonPosition({x: newX, y: newY});
            }

            if (
                enemyPosition &&
                summon &&
                creature &&
                turn === "summon" &&
                creature.health &&
                creature.health > 0 &&
                player.p_LeftHealth > 0
            ) {
                const distanceX = Math.abs(enemyPosition.x - summonPosition.x);
                const distanceY = Math.abs(enemyPosition.y - summonPosition.y);

                if (distanceX < 10 && distanceY < 10) {
                    const summonAttackTimeout = setTimeout(() => {
                        const totalAttack = rollDice('1d20') + summon["attacks"][0].bonus;
                        if (totalAttack > creature.armorClass) {
                            const damageDice = summon["attacks"][0].damage;
                            const damage = rollDice(damageDice);

                            setCreatureHealth(Math.max(player.p_LeftHealth - damage, 0));

                            setActionMessages((prev) => [
                                ...prev,
                                `La invocación ha atacado con ${summon["attacks"][0].name} y causó ${damage} puntos de daño.`,
                            ]);
                        } else {
                            setActionMessages((prev) => [...prev, `¡La invocación falló!`]);
                        }

                        switchTurn();
                    }, 1000);

                    return () => clearTimeout(summonAttackTimeout);
                } else {
                    switchTurn();
                }
            } else if (creature && turn === "summon" && creature.health && creature.health > 0 && player.p_LeftHealth > 0) {
                switchTurn();
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [turn]);
};
