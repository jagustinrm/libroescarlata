import { useState, useEffect } from 'react';

import { rollDice } from '../utils/rollDice.js';
export function useEnemyLoader(level) {
    const [enemy, setEnemy] = useState(null); // Cambia el estado inicial a `null` para diferenciar "sin cargar".
    const [isLoading, setIsLoading] = useState(true); // Nuevo estado para la carga.
    const [error, setError] = useState(null); // Maneja posibles errores.

    useEffect(() => {
        const loadEnemies = async () => {
            try {
                const res = await fetch('/mocks/creatures.json');
                const creatures = await res.json();

                const filteredCreatures = creatures.creatures.filter(creature => creature.level === level);

                if (filteredCreatures.length === 0) {
                    throw new Error(`No se encontraron enemigos de nivel ${level}`);
                }

                const randomIndex = Math.floor(Math.random() * filteredCreatures.length);
                const selectedEnemy = filteredCreatures[randomIndex];
                const initialHealth = rollDice(selectedEnemy.hitPoints);

                const enemyWithHealth = {
                    ...selectedEnemy,
                    health: initialHealth,
                };

                setEnemy(enemyWithHealth);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        console.log(enemy)
        loadEnemies();
    }, [level]);

    return { enemy, isLoading, error }; // Devuelve más datos.
}

