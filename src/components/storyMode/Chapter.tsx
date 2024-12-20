
import { useSearchParams } from "react-router-dom";
import NPCDialog from "./NPCDialog";


export default function Chapter() {
  const [searchParams] = useSearchParams();
  
  // Obtener parámetros específicos
  const storyParam = searchParams.get("story");
//   const chapterParam = searchParams.get("chapter");

  // Parsear storyParam si viene combinado
  const [storyId, chapterId] = storyParam ? storyParam.split("-chapter=") : ["", ""];

  return (
    <div className="chapter-container rpgui-container framed-golden-2">
      <div>
      <h1>Historia: {storyId}</h1>
      <h2>Capítulo: {chapterId}</h2>
      </div>
      {/* <img className="chapterImg" src="/img/story/chapter-001.png" alt="" /> */}
        <div className="dialogsLogs">
            
            <NPCDialog 
                dialogId="dialog-1" 
                onDialogEnd={() => console.log("Diálogo terminado")} 
            />
        </div>
    </div>
  );
}
