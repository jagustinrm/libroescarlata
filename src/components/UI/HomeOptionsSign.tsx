import { useNavigate } from 'react-router-dom';

export default function HomeOptionsSign() {
  const navigate = useNavigate();
  function handleNavigate() {
    navigate('#');
  }
  return (
    <div>
      <img
        className="HomeOptionsSign "
        onClick={() => handleNavigate()}
        src="/img/UI/homeOptionsSign.png"
        alt="Cartel principal"
      />
    </div>
  );
}
