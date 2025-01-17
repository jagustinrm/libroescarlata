import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { usePlayerStore } from '../stores/playerStore';
import './UI/designRpg.css';
import ButtonEdited from './UI/ButtonEdited';
import { ref, get } from 'firebase/database'; // Importa desde Firebase
import { database } from '../firebase/firebaseConfig'; // Asegúrate de importar tu configuración de Firebase
import FirebaseItemsLoader from '../loaders/FirebaseItemsLoader';
const LandingPage: React.FC = () => {
  const { playerActions } = usePlayerStore();
  const [inputName, setInputName] = useState<string>('');
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false); // Estado para alternar vistas
  
  const handleSaveName = async () => {
    const playerId = inputName || 'guest-player'; // Usa "guest-player" si el input está vacío
    const playerRef = ref(database, `players/${playerId}`); // Referencia al jugador en la base de datos

    try {
      // Verifica si el jugador existe en Firebase
      const snapshot = await get(playerRef);
      if (snapshot.exists()) {
        alert('El nombre de usuario ya existe. Por favor, elige otro.');
        return;
      }
      playerActions.setPlayerName(playerId);
      FirebaseItemsLoader();
      setInputName(''); // Limpia el campo de entrada
      navigate('/characterSelector'); // Redirige a la siguiente página
    } catch (error) {
      console.error('Error al verificar el jugador en Firebase:', error);
      alert('Hubo un error al verificar el nombre. Inténtalo de nuevo.');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value);
  };

  const handleSubmit = () => {
    // event.preventDefault();
    if (playerName) {
      if (playerName === '') {
        const guestPlayer = 'guest-player';
        FirebaseItemsLoader()
        navigate(`/loadPlayer/${guestPlayer}`);
      }
      navigate(`/loadPlayer/${playerName}`);
    } else {
      FirebaseItemsLoader()
      alert('Por favor, ingresa un nombre de jugador.');
    }
  };
  const toggleView = () => {
    setIsCreatingAccount(!isCreatingAccount); // Alternar entre crear cuenta y cargar personaje
  };

  localStorage.removeItem('playerState');
  localStorage.removeItem('inventoryState');
  
  useEffect(() => {
    playerActions.resetPlayer()
  }, [])

  return (
    <>
      <div className="landingContainer rpgui-container framed-golden-2">
        <div className="landingTitleContainer">
          <img
            className="landingImg"
            src="/scarlet.ico"
            alt="El libro escarlata"
          />
          <h1>El Libro Escarlata</h1>
        </div>
        <p>
          Una persona se acerca hacia donde estás. Pasa entre las cenizas que
          flotan sobre los cadáveres de tu pueblo, mezclando su sobretodo negro
          con el humo que se esparce alrededor. Su máscara con forma de pájaro y
          el graznido de un cuervo que lo sobrevuela te erizan al piel.
        </p>
        <p>
          Se acerca, medio rengueando, y una vez que se encuentra delante tuyo
          mira tus ojos llorosos y te pregunta el nombre...
        </p>
        {isCreatingAccount ? (
          <>
            <h2>Tu nombre es: {inputName} </h2>
            <div className="playerLoaderButton">
              <input
                className="nameInput"
                type="text"
                placeholder="Ingresá tu nombre"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />
              <ButtonEdited
                label="Ingresar"
                width="130px"
                height="0px"
                onClick={handleSaveName}
              />

            </div>
            <div className='createAccount'>
            <p>¿No tenés cuenta?{' '}  </p>
              <p className="linkButton rpgui-cursor-point" onClick={toggleView}>
                Cargar personaje
              </p>
            </div>
          </>
        ) : (
          <>
            <h3>Cargar Personaje</h3>
            <div className="playerLoaderButton">
              <input
                type="text"
                id="playerName"
                className="nameInput"
                value={playerName}
                onChange={handleInputChange}
                placeholder="Cargar personaje"
              />
              <ButtonEdited
                label="Cargar"
                width="130px"
                height="0px"
                onClick={handleSubmit}
              />
            </div>
            <div className='createAccount'>
            <p>¿No tienes una cuenta?{' '}</p>
              <p className="linkButton rpgui-cursor-point " onClick={toggleView}>
                Crear cuenta
              </p>
            </div>

          </>
        )}
      </div>
    </>
  );
};

export default LandingPage;
