export function verifySymbols(symbol1, symbol2) {
    if (!symbol1 || !symbol2 || symbol1[0] === symbol2[0]) {
        throw new Error("Symbols are in incorrect format");
    }
    return true;
}

export function verifyDifficulty(difficulty, computers) {
    if (difficulty < 0 || difficulty >= computers.length) {
        throw new Error("Difficulty is out of range");
    }
    return true;
}

export function verifyMoves(moves, symbol1, symbol2) {
    if (moves.length >= 9) throw new Error("Moves are in incorrect format");
    let cellsPlayed = new Set();

    for (let i = 0; i < moves.length; i++) {
        if (
            moves[i].row === undefined ||
            moves[i].col === undefined ||
            moves[i].row < 0 ||
            moves[i].row > 2 ||
            moves[i].col < 0 ||
            moves[i].col > 2
        )
            throw new Error("Moves are in incorrect format");

        let cell = moves[i].row + "-" + moves[i].col;
        if (cellsPlayed.has(cell))
            throw new Error("Moves are in incorrect format");
        cellsPlayed.add(cell);

        let symbol = i % 2 === 0 ? symbol1 : symbol2;
        if (moves[i].symbol !== symbol)
            throw new Error("Moves are in incorrect format");
    }
    return true;
}
