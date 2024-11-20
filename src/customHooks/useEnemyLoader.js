import { useState, useEffect } from 'react';
import { rollDice } from '../utils/rollDice.js';

export function useEnemyLoader(level) {
    const [enemy, setEnemy] = useState(null); // Estado inicial de enemigo.
    const [isLoading, setIsLoading] = useState(true); // Indica si está cargando.
    const [error, setError] = useState(null); // Manejo de errores.

    useEffect(() => {
        const loadEnemies = async () => {
            try {
                const res = await fetch('/mocks/creatures.json');
                const data = await res.json();

                // Extraer criaturas
                const creatures = data.creatures;

                // Filtrar enemigos por nivel
                const filteredCreatures = creatures.filter(creature => creature.level === level);

                // Si no hay enemigos del nivel, buscar el nivel máximo
                const finalCreatures =
                    filteredCreatures.length > 0
                        ? filteredCreatures
                        : creatures.filter(
                              creature => creature.level === Math.max(...creatures.map(c => c.level))
                          );

                if (finalCreatures.length === 0) {
                    throw new Error(`No se encontraron enemigos de nivel ${level}.`);
                }

                // Seleccionar enemigo aleatorio
                const randomIndex = Math.floor(Math.random() * finalCreatures.length);
                const selectedEnemy = finalCreatures[randomIndex];

                // Calcular puntos de vida iniciales
                const initialHealth = rollDice(selectedEnemy.hitPoints);

                // Configurar enemigo con salud inicial
                setEnemy({
                    ...selectedEnemy,
                    health: initialHealth,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadEnemies();
    }, []);

    return { enemy, isLoading, error }; // Devolver estado.
}
