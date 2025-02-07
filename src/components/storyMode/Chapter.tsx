import { useNavigate } from 'react-router-dom';
import NPCDialog from './NPCDialog';
import useGlobalState from '../../customHooks/useGlobalState';

export default function Chapter() {
  const { currentChapter } = useGlobalState();
  const backgroundImageUrl = `/img/story/chapter-00${currentChapter.chapterId}.png`;
  const navigate = useNavigate();

  return (
    <div
      className="chapter-container rpgui-container framed-golden-2"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
      }}
    >
      <div>
        <h1>Historia: {currentChapter.storyId}</h1>
        <h2>Capítulo: {currentChapter.chapterId}</h2>
      </div>
      <div className="dialogsLogs">
        <NPCDialog onDialogEnd={() => navigate(-1)} />
      </div>
    </div>
  );
}
