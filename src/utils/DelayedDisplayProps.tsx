import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface DelayedDisplayProps {
  children: React.ReactNode;
  delay: number;
  duration: number; // Duración de la transición
}

const DelayedDisplay: React.FC<DelayedDisplayProps> = ({
  children,
  delay,
  duration,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // Para controlar si estamos en transición
  const [shouldRender, setShouldRender] = useState(false); // Controla si debe renderizarse el componente
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    setIsVisible(false);

    // Primero ocultamos el componente
    const hideTimer = setTimeout(() => {
      setShouldRender(false);
    }, duration); // El tiempo de duración de la transición de desaparición

    // Después de un retraso, mostramos el componente
    const showTimer = setTimeout(() => {
      setShouldRender(true); // Permitimos renderizar el componente
      setIsVisible(true); // Lo hacemos visible de nuevo después del retraso
      setIsTransitioning(false); // Ya no estamos en transición
    }, delay + duration); // Tiempo de retraso + duración de la animación

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(showTimer); // Limpiamos los temporizadores al desmontar
    };
  }, [location, delay, duration]);

  return (
    <>
      {isTransitioning ? (
        <Loading /> // Mostrar el loading mientras se carga el componente
      ) : (
        shouldRender && (
          <div
            className={`app-container ${isVisible ? 'visible' : 'hidden'}`}
            style={{
              transition: `opacity ${duration}ms ease-in-out`, // Aquí se agrega la animación de opacidad
            }}
          >
            {children}
          </div>
        )
      )}
    </>
  );
};

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <p>Loading...</p>
      {/* Puedes agregar un spinner o cualquier otro indicador aquí */}
    </div>
  );
};

export default DelayedDisplay;
