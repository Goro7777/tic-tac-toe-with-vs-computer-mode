export default function GameBoard({ moves, onSelectEmptySquare }) {
    function handleSelectSquare(row, col, isEmpty) {
        if (isEmpty) {
            onSelectEmptySquare(row, col);
        }
    }

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
                            handleSelectSquare(rowIndex, colIndex, !playedCell)
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

    return <ol id="game-board">{rows}</ol>;
}
