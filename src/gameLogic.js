// const moves = [
//     { row: 0, col: 0, symbol: "X" },
//     { row: 1, col: 1, symbol: "O" },
//     { row: 0, col: 1, symbol: "X" },
//     { row: 0, col: 2, symbol: "O" },
// ];

function randomIntegerBetween(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

export function getWeekComputerMove(moves, symbol_1, symbol_2) {
    let symbol = moves.length % 2 === 0 ? symbol_1 : symbol_2;

    let possibleMoves = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (!moves.find((move) => move.row === row && move.col === col)) {
                possibleMoves.push({ row, col, symbol });
            }
        }
    }

    let index = randomIntegerBetween(0, possibleMoves.length);
    return possibleMoves[index];
}

export function getWinner(moves) {
    if (moves.length === 0) return [];

    const potentialWinnerSymbol = moves[moves.length - 1].symbol;

    let winningMoves = [];

    // check first diagonal
    let firstDiagonalMoves = [];
    for (let i = 0; i < 3; i++) {
        let j = i;
        let move = moves.find(
            (move) =>
                move.row === i &&
                move.col === j &&
                move.symbol === potentialWinnerSymbol
        );
        if (move) firstDiagonalMoves.push(move);
        else break;
    }
    if (firstDiagonalMoves.length === 3) winningMoves.push(firstDiagonalMoves);

    // check second diagonal
    let secondDiagonalMoves = [];
    for (let i = 0; i < 3; i++) {
        let j = 2 - i;
        let move = moves.find(
            (move) =>
                move.row === i &&
                move.col === j &&
                move.symbol === potentialWinnerSymbol
        );
        if (move) secondDiagonalMoves.push(move);
        else break;
    }
    if (secondDiagonalMoves.length === 3)
        winningMoves.push(secondDiagonalMoves);

    // check rows
    for (let i = 0; i < 3; i++) {
        let rowMoves = [];
        for (let j = 0; j < 3; j++) {
            let move = moves.find(
                (move) =>
                    move.row === i &&
                    move.col === j &&
                    move.symbol === potentialWinnerSymbol
            );
            if (move) rowMoves.push(move);
            else break;
        }
        if (rowMoves.length === 3) winningMoves.push(rowMoves);
    }

    // check columns
    for (let j = 0; j < 3; j++) {
        let colMoves = [];
        for (let i = 0; i < 3; i++) {
            let move = moves.find(
                (move) =>
                    move.row === i &&
                    move.col === j &&
                    move.symbol === potentialWinnerSymbol
            );
            if (move) colMoves.push(move);
            else break;
        }
        if (colMoves.length === 3) winningMoves.push(colMoves);
    }

    return winningMoves;
}
