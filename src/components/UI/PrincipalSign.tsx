import { useNavigate } from 'react-router-dom';
import usePlayerStore from '../../stores/playerStore';

export default function PrincipalSign() {
  const navigate = useNavigate();
  function handleNavigate() {
    navigate('/storyMode');
  }
  const c_LeftHealth = usePlayerStore(state => state.player.c_LeftHealth);
  const style: React.CSSProperties = c_LeftHealth <= 0 
  ? { filter: 'grayscale(100%)', pointerEvents: 'none', cursor: 'not-allowed' } 
  : {};


  return (
    <div>
      <img
        className="principalSign rpgui-cursor-point"
        onClick={() => handleNavigate()}
        src="/img/UI/principalSign.png"
        alt="Cartel principal"
        style={style}
      />
    </div>
  );
}
