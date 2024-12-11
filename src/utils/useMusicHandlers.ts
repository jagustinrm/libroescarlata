import { useState } from 'react';
// import { useSoundStore } from '../stores/soundsStore'; // Asegúrate de que la ruta sea correcta
// Hook para manejar la música
export const useMusicHandler = (
//     {
//   name,
//   type,
//   volume,
//   loop,
//   source,
// }: {
//   name: string;
//   type: string
//   volume: number;
//   loop: boolean;
//   source: string;
// }
) => {
//   const { playSound, stopSound } = useSoundStore(); // Asumiendo que tienes estos métodos en tu store
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  const handleMusicToggle = () => {
    setIsMusicPlaying((prevState) => !prevState);
  };

//   useEffect(() => {
//     if (isMusicPlaying) {
//       playSound({
//         name,
//         type,
//         volume,
//         loop,
//         source,
//       });
//     } else {
//       stopSound(name);
//     }
//   }, [isMusicPlaying, playSound, stopSound, name, type, volume, loop, source]);

  return { isMusicPlaying, handleMusicToggle };
};
