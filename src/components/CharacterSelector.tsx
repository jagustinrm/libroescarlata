import { useEffect, useState } from "react";

export default function CharacterSelector() {
    const [username, setUsername] = useState<string | null>('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []);

    const handleButtonClick = (clase: string) => {
        localStorage.setItem('classC', clase); 
        localStorage.setItem('level', '1'); 
        localStorage.setItem('playerExp', '0')
        localStorage.setItem('xpToNextLevel', '1000')
        localStorage.setItem('prevLevelXp', '0')
    };

    return (
        <>
            <h1>Hola, {username ? username : 'Invitado'}</h1>
            <p>Elige tu clase:</p>
            <a href="/home">
            <button onClick={() => handleButtonClick('Mago')}>Mago</button>   
            <button onClick={() => handleButtonClick('Guerrero')}>Guerrero</button>   
            </a>

        </>
    );
}
