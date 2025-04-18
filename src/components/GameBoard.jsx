export default function GameBoard({ moves, onSelectEmptySquare }) {
    function handleSelectSquare(row, col, isEmpty) {
        if (isEmpty) {
            onSelectEmptySquare(row, col);
        }
    }

    return (
        <ol id="game-board">
            <GameBoardRows moves={moves} onSelectSquare={handleSelectSquare} />
        </ol>
    );
}

function GameBoardRows({ moves, onSelectSquare }) {
    const rows = [];
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        let row = [];
        for (let colIndex = 0; colIndex < 3; colIndex++) {
            let playedCell = moves.find(
                (cell) => cell.row === rowIndex && cell.col === colIndex
            );
            row.push(
                <li key={colIndex}>
                    <button
                        onClick={() =>
                            onSelectSquare(rowIndex, colIndex, !playedCell)
                        }
                    >
                        {playedCell?.symbol}
                    </button>
                </li>
            );
        }
        rows.push(
            <li key={rowIndex}>
                <ol>{row}</ol>
            </li>
        );
    }

    return <>{rows}</>;
}
