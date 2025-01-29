import { Position } from "../stores/types/others";

export function calculateDistance(    
    position1: Position,
    position2: Position,
    diagonalPenalty = 1,) {
    const dx = Math.abs(position1.x - position2.x);
    const dy = Math.abs(position1.y - position2.y);

    if (dx === 0 && dy === 0) return -1;

    return Math.round(dx + dy - Math.min(dx, dy) * (1 - diagonalPenalty));
}