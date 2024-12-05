// src/utils/handleNewEnemyClick.ts
interface HandleNewEnemyClickProps {
    player: { name: string };
    handleMessage: (message: string, type: string, autoClose: boolean) => void;
    setTurn: (turn: "player" | "enemy") => void;
    updateEnemy: boolean;
    setUpdateEnemy: (value: boolean) => void;
    setPlayerPosition: React.Dispatch<React.SetStateAction<Position>>;
    setEnemyPosition: React.Dispatch<React.SetStateAction<Position>>;
}
interface Position {
  x: number;
  y: number;
}
export const handleNewEnemyClick = ({
    player,
    handleMessage,
    setTurn,
    updateEnemy,
    setUpdateEnemy,
    setPlayerPosition,
    setEnemyPosition
}: HandleNewEnemyClickProps) => {
    handleMessage(`${player.name} busca un nuevo enemigo...`, "success", false);
    setTimeout(() => {
        setTurn("player");
        setUpdateEnemy(!updateEnemy);
        const initialX = 0;
        const initialY = 45;
    // Compensar el ancho y alto de la imagen
        const offsetX = 10 / 1.2;
        const offsetY = 20 / 1.5;
        setPlayerPosition(        { // PLAYER
            x: initialX - offsetX,
            y: initialY - offsetY,
        })
        setEnemyPosition(        
            { // ENEMY
            x: 45 - offsetX,
            y: 0 - offsetY,
        })
    }, 1000);
};
