import React, { useEffect } from 'react';
import axios from 'axios';
import useStoryStore from '../stores/storyStore'; // Importa el hook para el store

const StoryLoader: React.FC = () => {
  const { loadStories } = useStoryStore(); // Desestructuramos las funciones que necesitamos del store

  useEffect(() => {
    // Cargar las historias al iniciar el juego
    const loadStoriesFromAPI = async () => {
      try {
        // Realizamos el fetching del archivo JSON
        const response = await axios.get('/mocks/stories.json');
        const storiesData = response.data;

        // Cargamos todas las historias en el store
        loadStories([storiesData]); // Utilizamos la función loadStories de useStoryStore

        // console.log('Historias cargadas correctamente:', stories);
      } catch (error) {
        console.error('Error al cargar las historias:', error);
      }
    };
    loadStoriesFromAPI();
  }, [loadStories]); // El efecto se ejecutará solo una vez cuando el componente se monte

  return null;
};

export default StoryLoader;
