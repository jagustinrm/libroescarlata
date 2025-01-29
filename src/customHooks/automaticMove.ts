import usePositionStore from "../stores/positionStore";
import { calculateDistance } from "../utils/calculateDistance";

export default function automaticMove () {
    const {enemyPosition, playerPosition, setEnemyPosition} = usePositionStore.getState();
    const adjustedDistance = calculateDistance(enemyPosition, playerPosition);
            const deltaX = playerPosition.x - enemyPosition.x;
            const deltaY = playerPosition.y - enemyPosition.y;
            
            // Definir los valores posibles de stepDistance
            const stepDistances = [5, 10]; // Puedes cambiar estos valores en el futuro
            const maxStepDistance = Math.max(...stepDistances);
            const minStepDistance = Math.min(...stepDistances);
            
            // Determinar la distancia efectiva de paso
            let stepDistance = adjustedDistance >= maxStepDistance ? maxStepDistance : minStepDistance;
            
            // Calcular la nueva posición
            let newX = enemyPosition.x;
            let newY = enemyPosition.y;
            
            const absDeltaX = Math.round(Math.abs(deltaX));
            const absDeltaY = Math.round(Math.abs(deltaY));
            
            if (absDeltaX > maxStepDistance) {
              newX = parseFloat((enemyPosition.x + Math.sign(deltaX) * stepDistance).toFixed(2));
            } else if (absDeltaX >= minStepDistance) {
              newX = parseFloat((enemyPosition.x + Math.sign(deltaX) * minStepDistance).toFixed(2));
            }
            
            if (absDeltaY > maxStepDistance) {
              newY = parseFloat((enemyPosition.y + Math.sign(deltaY) * stepDistance).toFixed(2));
            } else if (absDeltaY >= minStepDistance) {
              newY = parseFloat((enemyPosition.y + Math.sign(deltaY) * minStepDistance).toFixed(2));
            }
            
            // Mover al enemigo si corresponde
            if (adjustedDistance >= stepDistance) {
              setEnemyPosition({ x: newX, y: newY });
            }
          
    
}