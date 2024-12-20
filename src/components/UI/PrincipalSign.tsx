import { useNavigate } from 'react-router-dom';

export default function PrincipalSign() {
  const navigate = useNavigate();
  function handleNavigate() {
    navigate('/storyMode');
  }
  return (
    <div>
      <img
        className="principalSign rpgui-cursor-point"
        onClick={() => handleNavigate()}
        src="/img/UI/principalSign.png"
        alt="Cartel principal"
      />
    </div>
  );
}
