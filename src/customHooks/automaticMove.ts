import { Position } from '../stores/types/others';
import { calculateDistance } from '../utils/calculateDistance';

export default function automaticMove(
  attackerPosition: Position, 
  tagerPosition: Position,
  setAttackerPosition: (position: Position) => void

) {
  const adjustedDistance = calculateDistance(attackerPosition, tagerPosition);
  const deltaX = tagerPosition.x - attackerPosition.x;
  const deltaY = tagerPosition.y - attackerPosition.y;

  // Definir los valores posibles de stepDistance
  const stepDistances = [5, 10]; // Puedes cambiar estos valores en el futuro
  const maxStepDistance = Math.max(...stepDistances);
  const minStepDistance = Math.min(...stepDistances);

  // Determinar la distancia efectiva de paso
  let stepDistance =
    adjustedDistance >= maxStepDistance ? maxStepDistance : minStepDistance;

  // Calcular la nueva posición
  let newX = attackerPosition.x;
  let newY = attackerPosition.y;

  const absDeltaX = Math.round(Math.abs(deltaX));
  const absDeltaY = Math.round(Math.abs(deltaY));

  if (absDeltaX > maxStepDistance) {
    newX = parseFloat(
      (attackerPosition.x + Math.sign(deltaX) * stepDistance).toFixed(2),
    );
  } else if (absDeltaX >= minStepDistance) {
    newX = parseFloat(
      (attackerPosition.x + Math.sign(deltaX) * minStepDistance).toFixed(2),
    );
  }

  if (absDeltaY > maxStepDistance) {
    newY = parseFloat(
      (attackerPosition.y + Math.sign(deltaY) * stepDistance).toFixed(2),
    );
  } else if (absDeltaY >= minStepDistance) {
    newY = parseFloat(
      (attackerPosition.y + Math.sign(deltaY) * minStepDistance).toFixed(2),
    );
  }

  // Mover al enemigo si corresponde
  if (adjustedDistance >= stepDistance) {
    setAttackerPosition({ x: newX, y: newY });
  }
}
