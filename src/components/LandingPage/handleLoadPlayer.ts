// playerActions.ts
import { NavigateFunction } from "react-router-dom";
import FirebaseItemsLoader from "../../loaders/FirebaseItemsLoader";
import { loadPlayerFromFirebase } from "../../firebase/savePlayerStateToFirebase ";

interface HandleLoadPlayerProps {
  inputName?: string; // Puede venir undefined
  inputPassword: string;
  navigate: NavigateFunction;
}

export const handleLoadPlayer = async ({
  inputName,
  inputPassword,
  navigate,
}: HandleLoadPlayerProps): Promise<void> => {
  // Muestra el loader (puede ser síncrono o asíncrono según tu implementación)
  FirebaseItemsLoader();

  // Si no se proporcionó ningún nombre, se alerta
  if (inputName === undefined || inputName === null) {
    alert("Por favor, ingresa un nombre de jugador.");
    return;
  }

  // Si el nombre ingresado es una cadena vacía o solo espacios, se usa "guest-player"
  if (inputName.trim() === "") {
    const guestPlayer = "guest-player";
    const res = await loadPlayerFromFirebase(guestPlayer, "");
    if (res) {
      navigate("/home");
    }
    return;
  }

  // Se intenta cargar el jugador con los datos ingresados
  const res = await loadPlayerFromFirebase(inputName, inputPassword);
  if (res) {
    navigate("/home");
  }
};
