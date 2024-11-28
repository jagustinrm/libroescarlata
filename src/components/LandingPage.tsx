import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './LandingPage.css';
import { usePlayerStore } from '../stores/playerStore';
import './designRpg.css'
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
        <div className="landingContainer ">
            <h1>El Libro Escarlata</h1>
            <p>Una persona se acerca hacia donde estás. Pasa entre las cenizas que flotan sobre los cadáveres de tu pueblo, mezclando su sobretodo negro con el humo que se esparce alrededor. Su máscara con forma de pájaro y el graznido de un cuervo que lo sobrevuela te erizan al piel. </p>
            <p> Se acerca, medio rengueando, y una vez que se encuentra delante tuyo mira tus ojos llorozos y te pregunta el nombre... </p>
            <h3>Tu nombre es: {inputName}</h3>
            <input
                className='nameInput'
                type="text"
                placeholder="Ingresá tu nombre"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
            />
            <button className='rpgui-button' onClick={handleSaveName}>Ingresar</button>
            {/* <button className='rpgui-button'>Prueba</button> */}
        </div>
    );
};

export default LandingPage;
