import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import { Story } from "../../stores/types/story";
import BackButton from "../UI/BackButton";
import useStoryStore from "../../stores/storyStore";
import './StoryMode.css'; // Asumiendo que tenemos un archivo de estilos


export default function StoryMode() {
  const { stories } = useStoryStore(); // Accedemos a las historias desde el store
  const [currentPage, setCurrentPage] = useState(0); // Controlamos la página actual
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const navigate = useNavigate(); // Hook para navegar

  // Cargar la historia seleccionada al cambiar la página
  useEffect(() => {
    const story = stories[currentPage];
    if (story) {
      setCurrentStory(story);
    }
  }, [currentPage, stories]);

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < stories.length) {
      setCurrentPage(page);
    }
  };

  // Función para manejar el clic en un capítulo
  const handleChapterClick = (chapterId: number) => {
    if (currentStory) {
      const params = {
        storyId: currentStory.id,
        chapterId: chapterId.toString(),
      };
      navigate(`/chapter/?story=${params.storyId}-chapter=${params.chapterId}`); // Navegamos a Chapter con parámetros
    }
  };

  return (
    <div className="story-mode-container rpgui-container framed-golden-2">
      {currentStory && (
        <div>
          {/* Título de la historia */}
          <h1 className="story-title">{currentStory.title}</h1>

          {/* Paginador */}
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 0}>
              Anterior
            </button>
            <span>{currentPage + 1} / {stories.length}</span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === stories.length - 1}>
              Siguiente
            </button>
          </div>

          {/* Tarjetas de capítulos */}
          <div className="chapter-cards rpgui-cursor-point">
            {currentStory.chapters && currentStory.chapters.map((chapter) => 
            (
            <div 
              style={{ 
                backgroundImage: `url(/img/story/chapter-00${chapter.id}.png)`, 
                backgroundSize: "cover", // Ajusta según tu diseño
                backgroundPosition: "center"
              }} 
              key={chapter.id} 
              className="chapter-card" 
              onClick={() => handleChapterClick(chapter.id)}>
              <h3>{chapter.title}</h3>
            </div>
            ))}
          </div>
        </div>
      )}

      <BackButton />
    </div>
  );
}
