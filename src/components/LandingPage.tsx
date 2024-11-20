import { useState } from 'react';
import './LandingPage.css';

export default function LandingPage() {
    const [name, setName] = useState('');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleButtonClick = () => {
        localStorage.setItem('username', name);
    };

    return (
        <>
        <div className='landingContainer'>
        <h1>El Libro Escarlata</h1>
            <input 
                type="text" 
                placeholder="Ingresá tu nombre" 
                value={name}
                onChange={handleNameChange}
            />
            <a href="/characterSelector"><button onClick={handleButtonClick}>Ingresar</button></a>
        </div>
        </>
    );
}
