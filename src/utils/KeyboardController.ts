import React, { useEffect } from "react";

interface KeyboardControllerProps {
    setBoardPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
}

const KeyboardController: React.FC<KeyboardControllerProps> = ({ setBoardPosition }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setBoardPosition((prevPosition) => {
                switch (event.key) {
                    case "ArrowUp":
                        return { ...prevPosition, top: Math.max(prevPosition.top - 2, -90) };
                    case "ArrowDown":
                        return { ...prevPosition, top: Math.min(prevPosition.top + 2, 90) };
                    case "ArrowLeft":
                        return { ...prevPosition, left: Math.max(prevPosition.left - 2, 0) };
                    case "ArrowRight":
                        return { ...prevPosition, left: Math.min(prevPosition.left + 2, 90) };
                    default:
                        return prevPosition;
                }
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [setBoardPosition]);

    return null; // No renderiza nada
};

export default KeyboardController;
