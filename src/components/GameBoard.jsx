const INITIAL_GAME_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

export default function GameBoard({ moves, onSelectEmptySquare }) {
    let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];
    for (let move of moves) {
        gameBoard[move.row][move.col] = move.symbol;
    }

    function handleSelectSquare(row, col, symbol) {
        if (!symbol) {
            onSelectEmptySquare(row, col);
        }
    }

    return (
        <ol id="game-board">
            {gameBoard.map((row, rowIndex) => (
                <li key={rowIndex}>
                    <ol>
                        {row.map((symbol, colIndex) => (
                            <li key={colIndex}>
                                <button
                                    onClick={() =>
                                        handleSelectSquare(
                                            rowIndex,
                                            colIndex,
                                            symbol
                                        )
                                    }
                                >
                                    {symbol}
                                </button>
                            </li>
                        ))}
                    </ol>
                </li>
            ))}
        </ol>
    );
}
