import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './LandingPage.css';
import { usePlayerStore } from '../stores/playerStore';
import './UI/designRpg.css'

const LandingPage: React.FC = () => {
    const { playerActions } = usePlayerStore(); // Obtén la acción para actualizar el store
    const [inputName, setInputName] = useState<string>(''); // Estado local para el input
    const navigate = useNavigate(); // Hook para navegar
    const [playerName, setPlayerName] = useState('');
    const handleSaveName = () => {
        
        playerActions.setPlayerName(inputName); // Actualiza el nombre en el store
        if (inputName === '') playerActions.setPlayerName('guest-player') // Si el usuario no ingresa nada, le ponemos nombre
        setInputName(''); // Limpia el input
        navigate('/characterSelector'); // Navega a la siguiente página
    };
    


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerName(event.target.value);
      };
    
      // Función para manejar el submit del formulario
      const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (playerName) {
          if (playerName === '') {
            const guestPlayer =  "guest-player"
            navigate(`/loadPlayer/${guestPlayer}`);
          }
          navigate(`/loadPlayer/${playerName}`);
        } else {
          alert('Por favor, ingresa un nombre de jugador.');
        }
      };

      localStorage.removeItem('playerState');
      localStorage.removeItem('inventoryState');
      

    return (
        <div className="landingContainer rpgui-container framed-golden-2">
            <div className='landingTitleContainer'>
                <img className='landingImg' src="/scarlet.ico" alt="El libro escarlata" />
                <h1>El Libro Escarlata</h1>
            </div>
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
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={handleInputChange}
                placeholder="Ingresa el nombre del jugador"
            />
            <button type="submit">Cargar Jugador</button>
            </form>
        </div>
    );
};

export default LandingPage;
