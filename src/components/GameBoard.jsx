const INITIAL_GAME_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

export default function GameBoard({
    moves,
    onSelectEmptySquare,
    computerIsPlaying,
    activePlayerSymbol,
}) {
    let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];
    for (let move of moves) {
        gameBoard[move.row][move.col] = move.symbol;
    }

    function handleSelectSquare(row, col, isEmpty) {
        if (computerIsPlaying) return;

        if (isEmpty) {
            onSelectEmptySquare(row, col);
        }
    }

    function handleMouseEnter(e, isEmpty) {
        if (!computerIsPlaying && isEmpty)
            e.target.innerHTML = activePlayerSymbol;
    }

    function handleMouseLeave(e, isEmpty) {
        if (!computerIsPlaying && isEmpty) e.target.innerHTML = "";
    }

    return (
        <ol id="game-board">
            {gameBoard.map((row, rowIndex) => (
                <li key={rowIndex}>
                    <ol>
                        {row.map((symbol, colIndex) => (
                            <li key={colIndex}>
                                <button
                                    className={!symbol ? "empty" : ""}
                                    onMouseEnter={(e) =>
                                        handleMouseEnter(e, !symbol)
                                    }
                                    onMouseLeave={(e) =>
                                        handleMouseLeave(e, !symbol)
                                    }
                                    onClick={() =>
                                        handleSelectSquare(
                                            rowIndex,
                                            colIndex,
                                            !symbol
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
