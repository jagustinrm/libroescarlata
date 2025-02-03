import usePlayerStore from "../../stores/playerStore";
import {NavigateFunction } from "react-router-dom";
import { validateUsername } from "../../utils/validations/validateUsername";
import { validatePassword } from "../../utils/validations/validatePassword";
import { createPlayerToFirebase, verifyUserName } from "../../firebase/savePlayerStateToFirebase ";
import FirebaseItemsLoader from "../../loaders/FirebaseItemsLoader";

interface handleSaveNewPlayerProps {
    inputName: string
    inputPassword: string
    setInputName: (inputName: string) => void;
    navigate: NavigateFunction
}

export const handleSaveNewPlayer = async ({inputName, inputPassword, setInputName, navigate}: handleSaveNewPlayerProps ) => {
    const {playerActions} = usePlayerStore.getState();

    if (inputName === '') {
      const guestPlayer = 'guest-player';
      playerActions.setPlayerName(guestPlayer);
      navigate('/characterSelector');
      return;
    }
    const validateRes = validateUsername(inputName)
    if (!validateRes) {
      console.log("Nombre de usuario incorrecto")
      return
    }
    const validatePRes = validatePassword(inputPassword,inputName)
    if (validatePRes) {
      console.log(validatePRes)
      return
    }
    
    const validateDbUsername = await verifyUserName(inputName)
    if (validateDbUsername) {
      console.log("Nombre de usuario ya existe en la base de datos")
    }

    const playerId = inputName || 'guest-player'; // Usa "guest-player" si el input está vacío

    await createPlayerToFirebase(inputName, inputPassword)
    try {
      playerActions.setPlayerName(playerId);
      FirebaseItemsLoader();
      setInputName(''); // Limpia el campo de entrada
      navigate('/characterSelector'); 
    } catch (error) {
      console.error('Error al verificar el jugador en Firebase:', error);
      alert('Hubo un error al verificar el nombre. Inténtalo de nuevo.');
    }
  };