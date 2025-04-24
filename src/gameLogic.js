// const moves = [
//     { row: 0, col: 0, symbol: "X" },
//     { row: 1, col: 1, symbol: "O" },
//     { row: 0, col: 1, symbol: "X" },
//     { row: 0, col: 2, symbol: "O" },
// ];

function randomIntegerBetween(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

export function getWinnerMoves(moves) {
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

function getPossibleMoves(moves, symbol) {
    let possibleMoves = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (!moves.find((move) => move.row === row && move.col === col)) {
                possibleMoves.push({ row, col, symbol });
            }
        }
    }
    return possibleMoves;
}

const LOOSING = "L";
const WINNING = "W";
const NO_SYMBOL = "-";

function positionIsLost(position, symbol1, symbol2) {
    const winningIndexesSets = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let set of winningIndexesSets) {
        let [index1, index2, index3] = set;
        if (
            position[index1] === position[index2] &&
            position[index2] === position[index3] &&
            (position[index1] === symbol1 || position[index1] === symbol2)
        )
            return true;
    }
    return false;
}

function buildMap(symbol1, symbol2) {
    let map = Object.create(null);

    function helper(position) {
        if (map[position]) return;

        if (positionIsLost(position, symbol1, symbol2)) {
            map[position] = { status: LOOSING };
            return;
        }

        let symbol1Count = 0;
        let symbol2Count = 0;
        for (let ch of position) {
            if (ch === symbol1) symbol1Count++;
            else if (ch === symbol2) symbol2Count++;
        }
        const nextSymbol = symbol1Count > symbol2Count ? symbol2 : symbol1;

        let childPositions = [];
        for (let i = 0; i < 9; i++) {
            if (position[i] !== symbol1 && position[i] !== symbol2) {
                let nextPosition =
                    position.substring(0, i) +
                    nextSymbol +
                    position.substring(i + 1);
                childPositions.push(nextPosition);
                helper(nextPosition);
            }
        }
        if (!childPositions.length) {
            map[position] = {};
            return;
        }
        map[position] = { childPositions };
        if (
            childPositions.find(
                (childPosition) => map[childPosition].status === LOOSING
            )
        ) {
            map[position].status = WINNING;
        } else if (
            childPositions.every(
                (childPosition) => map[childPosition].status === WINNING
            )
        ) {
            map[position].status = LOOSING;
        }
    }

    helper("---------");
    return map;
}

export function getWeekComputerMove(moves, symbol_1, symbol_2) {
    let symbol = moves.length % 2 === 0 ? symbol_1 : symbol_2;
    let possibleMoves = getPossibleMoves(moves, symbol);
    let index = randomIntegerBetween(0, possibleMoves.length);
    return possibleMoves[index];
}

export function getAverageComputerMoves(moves, symbol_1, symbol_2) {
    let symbol = moves.length % 2 === 0 ? symbol_1 : symbol_2;
    let possibleMoves = getPossibleMoves(moves, symbol);

    // if it exists, return a move to win
    let nextMoves = [...moves];
    for (let move of possibleMoves) {
        nextMoves.push(move);
        if (getWinnerMoves(nextMoves).length > 0) {
            return move;
        }
        nextMoves.pop();
    }

    // if it exists, return a move to prevent the opponent from winning
    let opponentSymbol = symbol === symbol_1 ? symbol_2 : symbol_1;
    let possibleOpponentMoves = possibleMoves.map((move) => ({
        ...move,
        symbol: opponentSymbol,
    }));
    for (let move of possibleOpponentMoves) {
        nextMoves.push(move);
        if (getWinnerMoves(nextMoves).length > 0) {
            move.symbol = symbol;
            return move;
        }
        nextMoves.pop();
    }

    // return a random move
    let index = randomIntegerBetween(0, possibleMoves.length);
    return possibleMoves[index];
}

function getPosition(moves) {
    let positionArray = new Array(9).fill(NO_SYMBOL);
    for (let move of moves) {
        positionArray[move.row * 3 + move.col] = move.symbol;
    }
    return positionArray.join("");
}

function getNextMove(moves, nextPosition) {
    for (let i = 0; i < 9; i++) {
        let symbol = nextPosition[i];

        if (symbol === NO_SYMBOL) continue;

        let row = Math.floor(i / 3);
        let col = i - row * 3;
        if (!moves.find((move) => move.row === row && move.col === col)) {
            return { row, col, symbol };
        }
    }
}

export function getStrongComputerMoves(moves, symbol_1, symbol_2) {
    let map = buildMap(symbol_1, symbol_2);

    const position = getPosition(moves);

    let bestNextPositions;
    if (map[position].status === WINNING) {
        // if my position is winning - choose among loosing childPositions
        bestNextPositions = map[position].childPositions.filter(
            (childPosition) => map[childPosition].status === LOOSING
        );
    } else {
        // else - choose emong non-winning child positions
        bestNextPositions = map[position].childPositions.filter(
            (childPosition) => map[childPosition].status !== WINNING
        );
    }

    let index = randomIntegerBetween(0, bestNextPositions.length);
    let move = getNextMove(moves, bestNextPositions[index]);
    return move;
}
