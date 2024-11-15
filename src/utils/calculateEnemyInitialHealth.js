export function calculateEnemyInitialHealth(hitPoints) {
    // Expresión regular para capturar los valores del formato XdY + Z
    const regex = /(\d+)d(\d+)(?:\s*\+\s*(\d+))?/;

    const match = hitPoints.match(regex);

    if (!match) {
        throw new Error(`Formato de hitPoints inválido: ${hitPoints}`);
    }

    const numDice = parseInt(match[1], 10); // Número de dados
    const dieSides = parseInt(match[2], 10); // Lados del dado
    const bonus = match[3] ? parseInt(match[3], 10) : 0; // Bonus adicional, si existe

    let total = 0;

    // Lanzar los dados
    for (let i = 0; i < numDice; i++) {
        total += Math.floor(Math.random() * dieSides) + 1;
    }

    // Agregar el bonus
    total += bonus;

    return total;
}
