export function rollDice(dice) {
    const regex = /(\d+)d(\d+)(?:\s*\+\s*(\d+))?/;
    const match = dice.match(regex);

 
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