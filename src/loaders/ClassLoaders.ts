import useClassStore from '../stores/classStore';
import { useEffect } from 'react';

const ClassLoader = () => {
    const { areClassesLoaded, setClasses } = useClassStore();

    useEffect(() => {
        // Solo cargar las clases si no han sido cargadas previamente
        if (!areClassesLoaded) {
            const loadClasses = async () => {
                try {
                    const res = await fetch('/mocks/clases.json'); // Ruta del archivo JSON
                    const data = await res.json();
                    setClasses(data); // Actualiza el estado global solo si no se ha cargado antes
                } catch (error) {
                    console.error('Error loading classes:', error);
                }
            };

            loadClasses();
        }
    }, [areClassesLoaded, setClasses]); // Aseguramos que solo se cargue cuando `areClassesLoaded` sea false

    return null; // No es necesario renderizar nada aquí
};

export default ClassLoader;
