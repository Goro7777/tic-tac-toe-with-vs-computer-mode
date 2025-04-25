const LOOSING = "L";
const WINNING = "W";
const NO_SYMBOL = "-";

const WINNING_INDICES_SETS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export function checkGameIsLost(moves, symbol1, symbol2) {
    let position = getPosition(moves);

    return checkPositionIsLost(position, symbol1, symbol2);
}

export function getWeekComputerMove(moves, symbol1, symbol2) {
    let symbol = moves.length % 2 === 0 ? symbol1 : symbol2;
    let possibleMoves = getPossibleMoves(moves, symbol);
    let index = randomIntegerBetween(0, possibleMoves.length);
    return possibleMoves[index];
}

export function getAverageComputerMove(moves, symbol1, symbol2) {
    let symbol = moves.length % 2 === 0 ? symbol1 : symbol2;
    let possibleMoves = getPossibleMoves(moves, symbol);

    // if it exists, return a move to win the game
    let nextMoves = [...moves];
    for (let move of possibleMoves) {
        nextMoves.push(move);
        if (checkGameIsLost(nextMoves, symbol1, symbol2)) {
            return move;
        }
        nextMoves.pop();
    }

    // if it exists, return a move to prevent the opponent from winning the game
    let opponentSymbol = symbol === symbol1 ? symbol2 : symbol1;
    let possibleOpponentMoves = possibleMoves.map((move) => ({
        ...move,
        symbol: opponentSymbol,
    }));
    for (let move of possibleOpponentMoves) {
        nextMoves.push(move);
        if (checkGameIsLost(nextMoves, symbol1, symbol2)) {
            move.symbol = symbol;
            return move;
        }
        nextMoves.pop();
    }

    // return a random move
    let index = randomIntegerBetween(0, possibleMoves.length);
    return possibleMoves[index];
}

let map = null;

export function getStrongComputerMove(moves, symbol1, symbol2) {
    if (!map) {
        map = buildPositionsTree(symbol1, symbol2);
    }

    const position = getPosition(moves);

    let bestNextPositions;
    if (map[position].status === WINNING) {
        // if my position is winning, choose among loosing child positions
        bestNextPositions = map[position].childPositions.filter(
            (childPosition) => map[childPosition].status === LOOSING
        );
    } else {
        // else choose emong non-winning child positions
        bestNextPositions = map[position].childPositions.filter(
            (childPosition) => map[childPosition].status !== WINNING
        );
    }

    let index = randomIntegerBetween(0, bestNextPositions.length);
    let move = getNextMove(moves, bestNextPositions[index]);
    return move;
}

function randomIntegerBetween(min, max) {
    return min + Math.floor((max - min) * Math.random());
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

function checkPositionIsLost(position, symbol1, symbol2) {
    for (let set of WINNING_INDICES_SETS) {
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

function buildPositionsTree(symbol1, symbol2) {
    let map = Object.create(null);

    function helper(position) {
        if (map[position]) return;

        if (checkPositionIsLost(position, symbol1, symbol2)) {
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
