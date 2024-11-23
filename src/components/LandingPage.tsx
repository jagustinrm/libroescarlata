import { useState } from 'react';
import './LandingPage.css';
import usePlayerStore from '../stores/playerStore';

const LandingPage: React.FC = () => {
    // const [name, setName] = useState('');

    const { player, setPlayerName } = usePlayerStore();
    const [inputName, setInputName] = useState<string>('');
    const handleSaveName = () => {
        setPlayerName(inputName); // Actualizar el nombre en el store
        setInputName(''); // Limpiar el input
      };
    

    // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setName(e.target.value);
    // };

    // const handleButtonClick = () => {
    //     localStorage.setItem('username', name);
    // };

    return (
        <>
        <div className='landingContainer'>
        
        <h1>El Libro Escarlata</h1>
            <h3>Bienvenide... {inputName}</h3>
            <input 
                type="text" 
                placeholder="Ingresá tu nombre" 
                value={inputName}
                // onChange={handleNameChange}
                onChange={(e) => setInputName(e.target.value)}
            />
            <a href="/characterSelector"><button 
            // onClick={handleButtonClick}
            onClick={handleSaveName}
            >
                Ingresar</button></a>
        </div>
        </>
    );
}

export default LandingPage