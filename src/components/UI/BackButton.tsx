import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  function handleBack() {
    navigate('/home');
  }
  return (
    <div>
      <img
        className="back-button-design rpgui-cursor-point"
        onClick={() => handleBack()}
        src="/img/UI/back-button.png"
        alt=""
      />
    </div>
  );
}
