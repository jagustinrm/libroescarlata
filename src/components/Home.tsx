import { useEffect, useState } from "react";
// @ts-expect-error Para que funcione 
import { usePlayerStats } from '../customHooks/usePlayerStats.js';

export default function Home() {
    const [username, setUsername] = useState<string | null>('');
    const [classC, setClassC] = useState<string | null>('');
    const { playerHealth, playerXp, playerLevel, xpToNextLevel} = usePlayerStats();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
        const storedclassC = localStorage.getItem('classC');
        setClassC(storedclassC);
    }, []);



    return(
        <>
        <p>{username}</p>
        <p>{classC}</p>
        <p>Lvl. {playerLevel}</p>
        <p>Exp. {playerXp}/ {xpToNextLevel}</p>
        <a href="/fightScene"><button>Pelear</button></a>
        <a href="#"><button>Tienda</button></a>
        <a href="#"><button>Armería</button></a>
        <a href="#"><button>Mascotas</button></a>
        </>
    )
}