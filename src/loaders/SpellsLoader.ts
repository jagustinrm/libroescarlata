import useSpellStore from '../stores/spellsStore';
import { useEffect } from 'react';

const SpellLoader = () => {
    const { areSpellsLoaded, setSpells } = useSpellStore();

    useEffect(() => {
        // Solo cargar los hechizos si no han sido cargados previamente
        if (!areSpellsLoaded) {
            const loadSpells = async () => {
                try {
                    const res = await fetch('/mocks/hechizos.json'); // Ruta del archivo JSON
                    const data = await res.json();
                    setSpells(data); // Actualiza el estado global solo si no se ha cargado antes
                } catch (error) {
                    console.error('Error loading spells:', error);
                }
            };

            loadSpells();
        }
    }, [areSpellsLoaded, setSpells]); // Aseguramos que solo se cargue cuando `areSpellsLoaded` sea false

    return null; // No es necesario renderizar nada aquí
};

export default SpellLoader;
