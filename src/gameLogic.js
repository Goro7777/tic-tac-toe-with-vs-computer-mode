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

export function checkGameIsLost(moves) {
    if (moves.length <= 3) return false;
    let position = getPosition(moves);
    return checkPositionIsLost(position);
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
