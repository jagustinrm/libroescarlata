import { useState, useEffect } from 'react';
import { rollDice } from '../utils/rollDice.ts';
import { useSearchParams } from "react-router-dom";
// import { CreatureInterface } from '../components/interfaces/CreatureInterface.ts';
import { Creature } from '../stores/types/creatures.ts';
import useCreatureStore from '../stores/creatures';

const BOSS_PROBABILITY = 0.05; // 5% de probabilidad para bosses

export function useEnemyLoader(level: number, dungeonLevel: number, updateEnemy: boolean) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    const type = searchParams.get("type") || "normal";

    const { creatures, bosses, setCreature } = useCreatureStore();

    const filterByLevel = (entities: Creature[], targetLevel: number, isBoss: boolean) => {
        const filtered = isBoss
            ? entities.filter(entity => entity.level === targetLevel)
            : entities.filter(entity => entity.level <= targetLevel);

        if (filtered.length > 0) return filtered;
        console.log(filtered)
        throw new Error(
            `No se encontraron ${isBoss ? 'bosses' : 'criaturas normales'} para el nivel ${isBoss ? dungeonLevel : level}.`
        );
    };

    const selectEnemy = () => {
        try {
            if (type === 'dungeon') {
                const isBoss = Math.random() < BOSS_PROBABILITY;

                if (isBoss && bosses.length > 0) {

                    const finalBosses = filterByLevel(bosses, dungeonLevel, true);
                    const randomBoss = finalBosses[Math.floor(Math.random() * finalBosses.length)];
                    const initialHealth = rollDice(randomBoss.hitPoints);

                    setCreature({ ...randomBoss, health: initialHealth });
                    return;
                }
            }

            const finalCreatures = filterByLevel(creatures, level, false);
            const randomCreature = finalCreatures[Math.floor(Math.random() * finalCreatures.length)];
            const initialHealth = rollDice(randomCreature.hitPoints);
            setCreature({ ...randomCreature, health: initialHealth });
        } catch (err: any) {
            setError(err.message || 'Error desconocido al seleccionar enemigo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewEnemyClick = ({
        player,
        handleMessage,
        setTurn,
        updateEnemy,
        setUpdateEnemy,
        setPlayerPosition,
        setEnemyPosition,
    }: any) => {
        handleMessage(`${player.name} busca un nuevo enemigo...`, "success", false);
        setTimeout(() => {
            setTurn("player");
            setUpdateEnemy(!updateEnemy);

            const initialX = 0;
            const initialY = 45;
            const offsetX = 10 / 1.2;
            const offsetY = 20 / 1.5;
           
            setPlayerPosition({ x: initialX - offsetX, y: initialY - offsetY });
            setEnemyPosition({ x: 45 - offsetX, y: 0 - offsetY });
        }, 1000);
    };

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        selectEnemy();
    }, [updateEnemy]);

    return { isLoading, error, handleNewEnemyClick };
}

