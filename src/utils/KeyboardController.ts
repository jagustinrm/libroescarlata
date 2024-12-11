import React, { useEffect } from "react";

const KeyboardController: React.FC = () => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const scrollStep = 150; // Cantidad de píxeles por movimiento
            const maxScrollX = document.documentElement.scrollWidth - window.innerWidth;
            const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

            const newScrollPosition = {
                left: Math.max(0, Math.min(window.scrollX, maxScrollX)),
                top: Math.max(0, Math.min(window.scrollY, maxScrollY)),
            };

            switch (event.key) {
                case "ArrowUp":
                    window.scrollTo({
                        top: Math.max(newScrollPosition.top - scrollStep, 0),
                        left: newScrollPosition.left,
                        behavior: "smooth", // Desplazamiento suave
                    });
                    break;
                case "ArrowDown":
                    window.scrollTo({
                        top: Math.min(newScrollPosition.top + scrollStep, maxScrollY),
                        left: newScrollPosition.left,
                        behavior: "smooth",
                    });
                    break;
                case "ArrowLeft":
                    window.scrollTo({
                        top: newScrollPosition.top,
                        left: Math.max(newScrollPosition.left - scrollStep, 0),
                        behavior: "smooth",
                    });
                    break;
                case "ArrowRight":
                    window.scrollTo({
                        top: newScrollPosition.top,
                        left: Math.min(newScrollPosition.left + scrollStep, maxScrollX),
                        behavior: "smooth",
                    });
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null; // No renderiza nada
};

export default KeyboardController;
