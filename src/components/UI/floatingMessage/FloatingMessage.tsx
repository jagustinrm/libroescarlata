import React, { useEffect, useState } from 'react';
import './FloatingMessage.css';
import { FloatingMessageProps } from '../../../stores/types/others';

const FloatingMessage: React.FC<FloatingMessageProps> = ({
  message,
  onComplete,
  position,
  textColor,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reiniciar visibilidad cada vez que el mensaje cambie
    setVisible(true);

    const timeout = setTimeout(() => {
      setVisible(false);
    }, 700); // Mostrar durante 1 segundo

    const cleanup = setTimeout(() => {
      onComplete();
    }, 1500); // Tiempo adicional para que desaparezca suavemente

    // Limpiar temporizadores al desmontar o cambiar mensaje
    return () => {
      clearTimeout(timeout);
      clearTimeout(cleanup);
    };
  }, [message]); // Agregar `message` para reiniciar el efecto cuando cambie

  return (
    <div
      className={`floating-message ${visible ? 'visible' : 'hidden'}`}
      style={{
        ...(position && {
          // Solo aplica posición si `position` está definido
          bottom: 'auto',
          left: 'auto',
          transform: `translate(${position.x - 5}vw, ${position.y}vw) rotateX(-30deg) rotateZ(-45deg)`,
          fontSize: '50px',
          backgroundColor: 'transparent',
        }),
        color: textColor, // Aplicar el color de letra
      }}
    >
      {message}
    </div>
  );
};

export default FloatingMessage;
