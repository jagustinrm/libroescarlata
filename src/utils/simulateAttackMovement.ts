interface Position {
  x: number;
  y: number;
}
type SetPositionType = (position: Position) => void;
export const simulateAttackMovement = (
  originalPosition: Position,
  offset: number,
  setPosition: SetPositionType,
) => {
  if (!setPosition) return;

  // Mover hacia la derecha
  setPosition({ x: originalPosition.x + offset, y: originalPosition.y });
  setTimeout(() => {
    // Mover hacia la izquierda
    setPosition({ x: originalPosition.x - offset, y: originalPosition.y });
    setTimeout(() => {
      // Volver a la posición inicial
      setPosition(originalPosition);
    }, 100); // Tiempo en milisegundos para el segundo movimiento
  }, 100); // Tiempo en milisegundos para el primer movimiento
};
