import { useEffect } from 'react';

const Particles = () => {
  const particleNum = 50; // Número de partículas
  const particleWidth = 10; // Ancho máximo de partículas en px
  const particleColor = 'hsl(180, 100%, 80%)'; // Color de las partículas

  // Generar un número aleatorio
  const random = (max: number) => Math.floor(Math.random() * max);

  // Crear y aplicar estilos dinámicamente
  const createParticleStyles = () => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';

    let styles = `
      .circle-container {
        position: absolute;
        transform: translateY(-10vh);
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        
      }

      .circle {
        z-index: 1
        width: 100%;
        height: 100%;
        border-radius: 50%;
        mix-blend-mode: screen;
        background-image: radial-gradient(
          ${particleColor},
          ${particleColor} 10%,
          hsla(180, 100%, 80%, 0) 56%
        );
        animation: fade-frames 200ms infinite, scale-frames 2s infinite;
      }

      @keyframes fade-frames {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
      }

      @keyframes scale-frames {
        0% { transform: scale3d(0.4, 0.4, 1); }
        50% { transform: scale3d(2.2, 2.2, 1); }
        100% { transform: scale3d(0.4, 0.4, 1); }
      }
    `;

    for (let i = 1; i <= particleNum; i++) {
      const circleSize = random(particleWidth);
      const startPositionY = random(10) + 100;
      const framesName = `move-frames-${i}`;
      const moveDuration = 7000 + random(4000);

      // Generar animaciones específicas
      styles += `
        @keyframes ${framesName} {
          from {
            transform: translate3d(${random(100)}vw, ${startPositionY}vh, 0);
          }
          to {
            transform: translate3d(${random(100)}vw, ${-startPositionY - random(30)}vh, 0);
          }
        }

        .circle-container:nth-child(${i}) {
          width: ${circleSize}px;
          height: ${circleSize}px;
          animation-name: ${framesName};
          animation-duration: ${moveDuration}ms;
          animation-delay: ${random(11000)}ms;

        }
      `;
    }

    // Inserta las reglas de estilo
    styleSheet.innerHTML = styles;
    document.head.appendChild(styleSheet);
  };

  // Crear partículas
  const createParticles = () => {
    const container = document.getElementById('particle-container');
    for (let i = 0; i < particleNum; i++) {
      const circleContainer = document.createElement('div');
      circleContainer.className = 'circle-container';

      const circle = document.createElement('div');
      circle.className = 'circle';

      circleContainer.appendChild(circle);
      container?.appendChild(circleContainer);
    }
  };

  // Inicializar partículas
  useEffect(() => {
    createParticleStyles();
    createParticles();
  }, []);

  return (
    <div
      id="particle-container"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default Particles;
