export default function Log({ moves, onResetTo }) {
    return (
        <ol id="log">
            {moves.map((move, index) => (
                <li key={`${move.row}${move.col}`}>
                    {move.symbol} selected {move.row}, {move.col}
                    <button onClick={() => onResetTo(index + 1)}>
                        Continue from here
                    </button>
                </li>
            ))}
        </ol>
    );
}
