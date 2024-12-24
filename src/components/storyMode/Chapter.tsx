
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import NPCDialog from "./NPCDialog";
import useGlobalState from "../../customHooks/useGlobalState";

// Verificar si está completo o no

export default function Chapter() {
  const [searchParams] = useSearchParams();
  const {stories} = useGlobalState();
  // Obtener parámetros específicos
  const storyParam = searchParams.get("story");
  // Parsear storyParam si viene combinado
  const [storyId, chapterId] = storyParam ? storyParam.split("-chapter=") : ["", ""];
  const chapterIndex = stories[0].chapters?.findIndex(c => c.id === chapterId);
  const storyIndex = stories.findIndex(s => s.id === storyId);
  const backgroundImageUrl = `/img/story/chapter-00${chapterId}.png`;
  const navigate = useNavigate();
  return (
    <div className="chapter-container rpgui-container framed-golden-2"
    style={{
      backgroundImage: `url(${backgroundImageUrl})`
      }}
    >

      <div>
      <h1>Historia: {storyId}</h1>
      <h2>Capítulo: {chapterId}</h2>
      </div>
      {/* <img className="chapterImg" src="/img/story/chapter-001.png" alt="" /> */}
        <div className="dialogsLogs">
            
            <NPCDialog 
                dialogId={ stories[storyIndex].chapters[chapterIndex].dialogSequence } 
                onDialogEnd={() => navigate(-1)}
                chapterIndex = {chapterIndex}
                storyIndex = {storyIndex} 
                storyId = {storyId}
            />
        </div>
    </div>
  );
}
