import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './LandingPage.css';
import { usePlayerStore } from '../stores/playerStore';

const LandingPage: React.FC = () => {
    const { playerActions } = usePlayerStore(); // Obtén la acción para actualizar el store
    const [inputName, setInputName] = useState<string>(''); // Estado local para el input
    const navigate = useNavigate(); // Hook para navegar

    const handleSaveName = () => {
        playerActions.setPlayerName(inputName); // Actualiza el nombre en el store
        setInputName(''); // Limpia el input
        navigate('/characterSelector'); // Navega a la siguiente página
    };

    return (
        <div className="landingContainer">
            <h1>El Libro Escarlata</h1>
            <h3>Tu nombre es: {inputName}</h3>
            <input
                type="text"
                placeholder="Ingresá tu nombre"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
            />
            <button onClick={handleSaveName}>Ingresar</button>
        </div>
    );
};

export default LandingPage;
