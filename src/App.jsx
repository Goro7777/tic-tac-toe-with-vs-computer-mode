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
    const activePlayerSymbol = getActivePlayerSymbol(moves, SYMBOL_1, SYMBOL_2);

    function handleUpdateName(symbol, newName) {
        setPlayerNames((names) => ({
            ...names,
            [symbol]: newName,
        }));
    }

    function handleSelectEmptySquare(row, col) {
        setMoves((prevMoves) => {
            let currentPlayerSymbol = getActivePlayerSymbol(
                prevMoves,
                SYMBOL_1,
                SYMBOL_2
            );
            return [...prevMoves, { row, col, symbol: currentPlayerSymbol }];
        });
    }

    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    <Player
                        name={playerNames[SYMBOL_1]}
                        onUpdateName={handleUpdateName}
                        symbol="X"
                        isActive={activePlayerSymbol === SYMBOL_1}
                    />
                    <Player
                        name={playerNames[SYMBOL_2]}
                        onUpdateName={handleUpdateName}
                        symbol="O"
                        isActive={activePlayerSymbol === SYMBOL_2}
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

function getActivePlayerSymbol(moves, symbol_1, symbol_2) {
    let activePlayerSymbol = symbol_1;
    if (moves.length > 0 && moves[moves.length - 1].symbol === symbol_1) {
        activePlayerSymbol = symbol_2;
    }
    return activePlayerSymbol;
}
