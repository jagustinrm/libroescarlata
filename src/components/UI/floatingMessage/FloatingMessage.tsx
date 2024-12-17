import React, { useEffect, useState } from 'react';
import './FloatingMessage.css';

interface FloatingMessageProps {
  message: string;
  onComplete: () => void;
}

const FloatingMessage: React.FC<FloatingMessageProps> = ({
  message,
  onComplete,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reiniciar visibilidad cada vez que el mensaje cambie
    setVisible(true);

    const timeout = setTimeout(() => {
      setVisible(false);
    }, 900); // Mostrar durante 1 segundo

    const cleanup = setTimeout(() => {
      onComplete();
    }, 1500); // Tiempo adicional para que desaparezca suavemente

    // Limpiar temporizadores al desmontar o cambiar mensaje
    return () => {
      clearTimeout(timeout);
      clearTimeout(cleanup);
    };
  }, [message, onComplete]); // Agregar `message` para reiniciar el efecto cuando cambie

  return (
    <div className={`floating-message ${visible ? 'visible' : 'hidden'}`}>
      {message}
    </div>
  );
};

export default FloatingMessage;
