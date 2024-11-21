import { useState, useEffect } from 'react';
import { rollDice } from '../utils/rollDice.js';
import { useSearchParams } from "react-router-dom";

export function useEnemyLoader( level, dungeonLevel) {
    const [enemy, setEnemy] = useState(null); // Estado inicial de enemigo.
    const [isLoading, setIsLoading] = useState(true); // Indica si está cargando.
    const [error, setError] = useState(null); // Manejo de errores.
    const [searchParams] = useSearchParams();
    const [typeEnemy, setTypeEnemy] = useState(null)
    const type = searchParams.get("type") || "normal"; // "normal" por defecto
    const dungeonLevelInt = parseInt(dungeonLevel)
    useEffect(() => {
        const loadEnemies = async () => {
            try {
                // Cargar ambos archivos
                const creaturesRes = await fetch('/mocks/creatures.json');
                const bossesRes = await fetch('/mocks/bosses.json');
                const creaturesData = await creaturesRes.json();
                const bossesData = await bossesRes.json();

                const creatures = creaturesData.creatures; // Enemigos normales
                const bosses = bossesData; // Lista de bosses

                let selectedEnemy;

                if (type === 'dungeon') {
                    // Generar probabilidad del 5% para bosses
                    const isBoss = Math.random() < 0.5; // 5% de probabilidades
         
                    if (isBoss && bosses.length > 0) {
                                   
                        // Elegir un boss aleatorio si hay alguno
                        const filteredBosses = bosses.filter(boss => boss.level === dungeonLevelInt);
                        const finalBosses =
                        filteredBosses.length > 0
                            ? filteredBosses
                            : bosses.filter(
                                boss => boss.level < dungeonLevelInt
                              );
                        const randomBossIndex = Math.floor(Math.random() * finalBosses.length);
                        console.log(finalBosses)
                        selectedEnemy = finalBosses[randomBossIndex];
                        setTypeEnemy('boss')
                    } else {
                    
                        // Filtrar enemigos normales por nivel
                        const filteredCreatures = creatures.filter(creature => creature.level === level);
                        
                        // Si no hay enemigos normales del nivel, buscar el nivel máximo
                        const finalCreatures =
                            filteredCreatures.length > 0
                                ? filteredCreatures
                                : creatures.filter(
                                    creature => creature.level < level
                                  );

                        if (finalCreatures.length === 0) {
                            throw new Error(`No se encontraron enemigos de nivel ${level}.`);
                        }

                        // Elegir enemigo normal aleatorio
                        const randomIndex = Math.floor(Math.random() * finalCreatures.length);
                        selectedEnemy = finalCreatures[randomIndex];
                        setTypeEnemy('normal')
                    }
                } else {
                    // Lógica estándar para otros tipos de combate
                    const filteredCreatures = creatures.filter(creature => creature.level === level);
                    const finalCreatures =
                        filteredCreatures.length > 0
                            ? filteredCreatures
                            : creatures.filter(
                                  creature => creature.level === Math.max(...creatures.map(c => c.level))
                              );

                    if (finalCreatures.length === 0) {
                        throw new Error(`No se encontraron enemigos de nivel ${level}.`);
                    }

                    // Elegir enemigo normal aleatorio
                    const randomIndex = Math.floor(Math.random() * finalCreatures.length);
                    selectedEnemy = finalCreatures[randomIndex];
                    setTypeEnemy('normal')
                }


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

    return { enemy, isLoading, error, typeEnemy }; // Devolver estado.
}
