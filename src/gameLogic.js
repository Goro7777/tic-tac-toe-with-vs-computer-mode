const LOOSING = "L";
const WINNING = "W";
const SYMBOL_1 = "A";
const SYMBOL_2 = "B";
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
const POSITIONS = buildPositionsTree();

export function checkGameIsLost(moves) {
    if (moves.length <= 3) return false;
    let position = getPosition(moves);
    return checkPositionIsLost(position);
}

export function getWeekComputerMove(moves, symbol1, symbol2) {
    let symbol = moves.length % 2 === 0 ? symbol1 : symbol2;
    let possibleMoves = getPossibleMoves(moves, symbol);
    return getRandomElement(possibleMoves);
}

export function getMediumComputerMove(moves, symbol1, symbol2) {
    let symbol = moves.length % 2 === 0 ? symbol1 : symbol2;
    let possibleMoves = getPossibleMoves(moves, symbol);

    // if it exists, return a move to win the game
    let nextMoves = [...moves];
    for (let move of possibleMoves) {
        nextMoves.push(move);
        if (checkGameIsLost(nextMoves)) {
            return move;
        }
        nextMoves.pop();
    }

    // if it exists, return a move to prevent the opponent from winning the game
    let opponentSymbol = symbol === symbol1 ? symbol2 : symbol1;
    let nextOpponentMoves = [...moves];
    let possibleOpponentMoves = possibleMoves.map((move) => ({
        ...move,
        symbol: opponentSymbol,
    }));
    for (let move of possibleOpponentMoves) {
        nextOpponentMoves.push(move);
        if (checkGameIsLost(nextOpponentMoves)) {
            move.symbol = symbol;
            return move;
        }
        nextOpponentMoves.pop();
    }

    // return a random move
    return getRandomElement(possibleMoves);
}

export function getStrongComputerMove(moves, symbol1, symbol2) {
    const position = getPosition(moves);

    let bestNextPositions;
    if (POSITIONS[position].status === WINNING) {
        // if my position is winning, choose among loosing child positions
        bestNextPositions = POSITIONS[position].childPositions.filter(
            (childPosition) => POSITIONS[childPosition].status === LOOSING
        );
    } else {
        // else choose among non-winning child positions
        bestNextPositions = POSITIONS[position].childPositions.filter(
            (childPosition) => POSITIONS[childPosition].status !== WINNING
        );
    }

    let index = randomIntegerBetween(0, bestNextPositions.length);
    let move = getNextMove(moves, bestNextPositions[index]);
    move.symbol = move.symbol === SYMBOL_1 ? symbol1 : symbol2;
    return move;
}

function checkPositionIsLost(position) {
    for (let set of WINNING_INDICES_SETS) {
        let [index1, index2, index3] = set;
        if (
            position[index1] === position[index2] &&
            position[index2] === position[index3] &&
            position[index1] !== NO_SYMBOL
        )
            return true;
    }
    return false;
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

function buildPositionsTree() {
    let map = Object.create(null);
    let gameStartPosition = NO_SYMBOL.repeat(9);
    helper(gameStartPosition);
    return map;

    function helper(position) {
        if (map[position]) return;

        if (checkPositionIsLost(position)) {
            map[position] = { status: LOOSING };
            return;
        }

        let symbol1Count = 0;
        let symbol2Count = 0;
        for (let ch of position) {
            if (ch === SYMBOL_1) symbol1Count++;
            else if (ch === SYMBOL_2) symbol2Count++;
        }
        const nextSymbol = symbol1Count > symbol2Count ? SYMBOL_2 : SYMBOL_1;

        let childPositions = [];
        for (let i = 0; i < 9; i++) {
            if (position[i] !== SYMBOL_1 && position[i] !== SYMBOL_2) {
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
}

function getPosition(moves) {
    let positionArray = new Array(9).fill(NO_SYMBOL);
    for (let move of moves) {
        const isPlayer1 = move.symbol === moves[0].symbol;
        positionArray[move.row * 3 + move.col] = isPlayer1
            ? SYMBOL_1
            : SYMBOL_2;
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

function getRandomElement(array) {
    return array[randomIntegerBetween(0, array.length)];
}

function randomIntegerBetween(min, max) {
    return min + Math.floor((max - min) * Math.random());
}
