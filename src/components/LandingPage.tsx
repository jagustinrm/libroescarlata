import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { usePlayerStore } from '../stores/playerStore';
import './UI/designRpg.css';
import ButtonEdited from './UI/ButtonEdited';
import { ref, get } from 'firebase/database'; // Importa desde Firebase
import { database } from '../firebase/firebaseConfig'; // Asegúrate de importar tu configuración de Firebase
import FirebaseItemsLoader from '../loaders/FirebaseItemsLoader';
import { validateUsername } from '../utils/validations/validateUsername';
import { ValidatePassword } from '../utils/validations/validatePassword';
import { useInstantSavePlayerState, verifyUserName } from '../firebase/savePlayerStateToFirebase ';
const LandingPage: React.FC = () => {
  const { playerActions } = usePlayerStore();
  const [inputName, setInputName] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [validatedName, setValidatedName] = useState<boolean>(false);
  const [validatedPassword, setValidatedPassword] = useState<string>('');
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false); // Estado para alternar vistas
  const savePlayerState = useInstantSavePlayerState();

  const handleSaveName = async () => {
    const validateRes = validateUsername(inputName)

    if (!validateRes) {
      console.log("Nombre de usuario incorrecto")
      return
    }
    const validatePRes = ValidatePassword(inputPassword,inputName)
    if (validatePRes) {
      console.log(validatePRes)
      return
    }
    
    const validateDbUsername = await verifyUserName(inputName)
    if (validateDbUsername) {
      console.log("Nombre de usuario ya existe en la base de datos")
    }

    const playerId = inputName || 'guest-player'; // Usa "guest-player" si el input está vacío
    const playerRef = ref(database, `players/${playerId}`); // Referencia al jugador en la base de datos
    savePlayerState(inputPassword); 
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

  useEffect(() => {
    const validateRes = validateUsername(inputName)
    setValidatedName(validateRes)
  }, [inputName])
  useEffect(() => {
    const validateRes = ValidatePassword(inputPassword, inputName)
    setValidatedPassword(validateRes)
  }, [inputPassword, inputName])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value);
  };

  const handleSubmit = () => {
    // event.preventDefault();
    if (playerName) {
      if (playerName === '') {
        const guestPlayer = 'guest-player';
        FirebaseItemsLoader();
        navigate(`/loadPlayer/${guestPlayer}`);
      }
      navigate(`/loadPlayer/${playerName}`);
    } else {
      FirebaseItemsLoader();
      alert('Por favor, ingresa un nombre de jugador.');
    }
  };
  const toggleView = () => {
    setIsCreatingAccount(!isCreatingAccount); // Alternar entre crear cuenta y cargar personaje
  };

  localStorage.removeItem('playerState');
  localStorage.removeItem('inventoryState');

  useEffect(() => {
    playerActions.resetPlayer();
  }, []);

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
            <h2 style={{marginBottom: '3px'}} >Tu nombre es: {inputName} </h2>
            <div className="playerLoaderButton">
              <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                <input
                className="nameInput"
                type="text"
                placeholder="Ingresá tu nombre"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                />
                <input
                className="passInput"
                type="password"
                placeholder="Ingresá contraseña"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
              />
              </div>
              <div>
              {<ButtonEdited
                label="Ingresar"
                width="130px"
                height="0px"
                onClick={handleSaveName}
                disabled={!validatedName || validatedPassword ? true : false}
              />}

              </div>
              
            </div>

            <p style={{fontSize: '18px', marginBottom: '0px'}}>{validatedPassword} </p>
            <div className="createAccount">
              <p>¿Tenés cuenta? </p>
              <p className="linkButton rpgui-cursor-point" onClick={toggleView}>
                Cargar personaje
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 style={{marginBottom: '3px'}}>Cargar Personaje</h2>
            <div className="playerLoaderButton" style={{marginBottom: '10px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}} >
              <input
                type="text"
                id="playerName"
                className="nameInput"
                value={playerName}
                onChange={handleInputChange}
                placeholder="Cargar personaje"
              />
                                       <input
                className="passInput"
                type="password"
                placeholder="Ingresá contraseña"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
              />
              </div>
              <div>
              <ButtonEdited
                label="Cargar"
                width="130px"
                height="0px"
                onClick={handleSubmit}
              />
              </div>
              </div>
            <div className="createAccount">
              <p>¿No tenés cuenta? </p>
              <p
                className="linkButton rpgui-cursor-point "
                onClick={toggleView}
              >
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
