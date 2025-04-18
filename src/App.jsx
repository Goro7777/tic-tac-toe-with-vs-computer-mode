import { useState } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";

const SYMBOL_1 = "X";
const SYMBOL_2 = "O";

function App() {
    const [playerNames, setPlayerNames] = useState({
        [SYMBOL_1]: "Player 1",
        [SYMBOL_2]: "Player 2",
    });
    const [moves, setMoves] = useState([
        { row: 0, col: 0, symbol: "X" },
        { row: 1, col: 1, symbol: "O" },
        { row: 0, col: 1, symbol: "X" },
        { row: 0, col: 2, symbol: "O" },
    ]);
    const [activePlayerSymbol, setActivePlayerSymbol] = useState(SYMBOL_1);

    function handleUpdateName(symbol, newName) {
        setPlayerNames((names) => ({
            ...names,
            [symbol]: newName,
        }));
    }

    function handleSelectEmptySquare(row, col) {
        setMoves((prevMoves) => [
            ...prevMoves,
            { row, col, symbol: activePlayerSymbol },
        ]);
        setActivePlayerSymbol((prevSymbol) =>
            prevSymbol === SYMBOL_1 ? SYMBOL_2 : SYMBOL_1
        );
    }

    return (
        <main>
            <div id="game-container">
                <ol id="players">
                    <Player
                        name={playerNames[SYMBOL_1]}
                        onUpdateName={handleUpdateName}
                        symbol="X"
                    />
                    <Player
                        name={playerNames[SYMBOL_2]}
                        onUpdateName={handleUpdateName}
                        symbol="O"
                        rtl={true}
                    />
                </ol>
                <GameBoard
                    moves={moves}
                    onSelectEmptySquare={handleSelectEmptySquare}
                />
            </div>
        </main>
    );
}

export default App;
