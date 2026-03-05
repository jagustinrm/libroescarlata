import React from 'react';

interface GlobalLoadingScreenProps {
    progress: number;
}

export const GlobalLoadingScreen: React.FC<GlobalLoadingScreenProps> = ({ progress }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#111',
                color: '#e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999, // Asegurarnos que esté por encima de TODO
                fontFamily: 'monospace', // Puedes cambiarlo a tu tipografía de RPG
            }}
        >
            <h1 style={{ marginBottom: '30px', fontSize: '2rem', textShadow: '2px 2px 4px #000' }}>
                Cargando Mundo Escarlata...
            </h1>

            {/* Contenedor de la barra de progreso */}
            <div
                style={{
                    width: '50%',
                    maxWidth: '400px',
                    height: '24px',
                    backgroundColor: '#333',
                    border: '2px solid #666',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}
            >
                {/* Fill de la barra de progreso */}
                <div
                    style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: '#8b0000', // Rojo escarlata
                        transition: 'width 0.3s ease-out',
                        boxShadow: '0 0 10px #ff0000'
                    }}
                ></div>
            </div>

            <p style={{ marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {progress}%
            </p>
        </div>
    );
};
