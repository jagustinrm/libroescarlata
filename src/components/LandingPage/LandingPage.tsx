import './LandingPage.css';
import '../UI/designRpg.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonEdited from '../UI/ButtonEdited';
import useGlobalState from '../../customHooks/useGlobalState';
import { useValidateInputs } from '../../customHooks/useValidateInputs';
import { handleSaveNewPlayer } from './handleSaveNewPlayer';
import { handleLoadPlayer } from './handleLoadPlayer';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputName, setInputName] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [validatedName, setValidatedName] = useState<string>('');
  const [validatedPassword, setValidatedPassword] = useState<string>('');
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false); // Estado para alternar vistas
  const { setAreItemsLoaded, playerActions } = useGlobalState();
  useValidateInputs(
    inputName,
    inputPassword,
    setValidatedName,
    setValidatedPassword,
  );

  const onNewPlayer = async () => {
    // Crear nuevo personaje
    await handleSaveNewPlayer({
      inputName,
      inputPassword,
      setInputName,
      navigate,
    });
  };
  const onLoadPlayer = async () => {
    // Cargar personaje
    await handleLoadPlayer({ inputName, inputPassword, navigate });
  };
  const toggleView = () => {
    // Alternar entre crear cuenta y cargar personaje
    setIsCreatingAccount(!isCreatingAccount);
  };

  useEffect(() => {
    playerActions.resetPlayer();
    setAreItemsLoaded(false);
    localStorage.removeItem('playerState');
    localStorage.removeItem('inventoryState');
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
            <h2 style={{ marginBottom: '3px' }}>Tu nombre es: {inputName} </h2>
            <div className="playerLoaderButton">
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
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
                {
                  <ButtonEdited
                    label="Ingresar"
                    width="130px"
                    height="0px"
                    onClick={onNewPlayer}
                    disabled={
                      validatedName !== '' || validatedPassword !== ''
                    }
                  />
                }
              </div>
            </div>
            <div style={{ minHeight: '30px', marginTop: '5px' }}>
              {validatedName && (
                <p style={{ fontSize: '16px', marginBottom: '0px', color: '#ffbaba' }}>
                  {validatedName}
                </p>
              )}
              {validatedPassword && (
                <p style={{ fontSize: '16px', marginBottom: '0px', color: '#ffbaba' }}>
                  {validatedPassword}
                </p>
              )}
            </div>
            <div className="createAccount">
              <p>¿Tenés cuenta? </p>
              <p className="linkButton rpgui-cursor-point" onClick={toggleView}>
                Cargar personaje
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: '3px' }}>Cargar Personaje</h2>
            <div
              className="playerLoaderButton"
              style={{ marginBottom: '10px' }}
            >
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                <input
                  type="text"
                  id="playerName"
                  className="nameInput"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
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
                  onClick={onLoadPlayer}
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
