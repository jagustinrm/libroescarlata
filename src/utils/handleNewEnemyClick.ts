// src/utils/handleNewEnemyClick.ts
interface HandleNewEnemyClickProps {
    player: { name: string };
    handleMessage: (message: string, type: string, autoClose: boolean) => void;
    setTurn: (turn: "player" | "enemy") => void;
    updateEnemy: boolean;
    setUpdateEnemy: (value: boolean) => void;
}

export const handleNewEnemyClick = ({
    player,
    handleMessage,
    setTurn,
    updateEnemy,
    setUpdateEnemy,
}: HandleNewEnemyClickProps) => {
    handleMessage(`${player.name} busca un nuevo enemigo...`, "success", false);
    setTimeout(() => {
        setTurn("player");
        setUpdateEnemy(!updateEnemy);
    }, 1000);
};
