import { useState, useEffect } from 'react';
import { rollDice } from '../utils/rollDice.ts';
import { useSearchParams } from "react-router-dom";
import { CreatureInterface } from '../components/interfaces/CreatureInterface.ts';

const BOSS_PROBABILITY = 0.05; // 5% de probabilidad para bosses

export function useEnemyLoader(level: number, dungeonLevel: number, updateEnemy: boolean) {
    const [enemy, setEnemy] = useState<CreatureInterface | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const [typeEnemy, setTypeEnemy] = useState<'normal' | 'boss' >('normal');
    const type = searchParams.get("type") || "normal";

    // Función auxiliar para filtrar enemigos por nivel
    const filterByLevel = (entities: CreatureInterface[], targetLevel: number, isBoss: boolean) => {
        const filtered = isBoss
            ? entities.filter(entity => entity.level === targetLevel) // Bosses: solo nivel exacto
            : entities.filter(entity => entity.level <= targetLevel); // Normales: mismo nivel o menor

        if (filtered.length > 0) return filtered;

        throw new Error(
            `No se encontraron ${isBoss ? 'bosses' : 'criaturas normales'} para el nivel ${
                isBoss ? dungeonLevel : level
            }.`
        );
    };

    // Función para cargar enemigos desde los archivos JSON
    const loadEnemies = async () => {
        try {
            const [creaturesRes, bossesRes] = await Promise.all([
                fetch('/mocks/creatures.json'),
                fetch('/mocks/bosses.json'),
            ]);
            const creaturesData: { creatures: CreatureInterface[] } = await creaturesRes.json();
            const bossesData: CreatureInterface[] = await bossesRes.json();

            return { creatures: creaturesData.creatures, bosses: bossesData };
        } catch (error) {
            throw new Error('Error al cargar los datos de enemigos.');
        }
    };

    // Función principal para seleccionar un enemigo
    const selectEnemy = (creatures: CreatureInterface[], bosses: CreatureInterface[]) => {
        if (type === 'dungeon') {
            const isBoss = Math.random() < BOSS_PROBABILITY;

            if (isBoss && bosses.length > 0) {
                const finalBosses = filterByLevel(bosses, dungeonLevel, true);
                const randomBoss = finalBosses[Math.floor(Math.random() * finalBosses.length)];
                setTypeEnemy('boss');
                return randomBoss;
            }
        }

        const finalCreatures = filterByLevel(creatures, level, false);
        const randomCreature = finalCreatures[Math.floor(Math.random() * finalCreatures.length)];
        setTypeEnemy('normal');
        return randomCreature;
    };

    useEffect(() => {
        const fetchEnemy = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const { creatures, bosses } = await loadEnemies();
                const selectedEnemy = selectEnemy(creatures, bosses);

                // Calcular puntos de vida iniciales
                const initialHealth = rollDice(selectedEnemy.hitPoints);

                // Configurar enemigo con salud inicial
                setEnemy({ ...selectedEnemy, health: initialHealth });
            } catch (err: any) {
                setError(err.message || 'Error desconocido al cargar enemigos.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnemy();
    }, [updateEnemy]);

    return { enemy, isLoading, error, typeEnemy };
}
