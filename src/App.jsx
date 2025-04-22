import { useState } from "react";
import { getWinner } from "./winner.js";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import GameOver from "./components/GameOver.jsx";
import Log from "./components/Log.jsx";

const SYMBOL_1 = "X";
const SYMBOL_2 = "O";

const DEFAULT_PLAYER_NAMES = {
    [SYMBOL_1]: "Player 1",
    [SYMBOL_2]: "Player 2",
};

const COMPUTER_TYPES = ["Weak Computer", "Average Computer", "Strong Computer"];

function App() {
    const [players, setPlayers] = useState({
        [SYMBOL_1]: { name: DEFAULT_PLAYER_NAMES[SYMBOL_1], isComputer: false },
        [SYMBOL_2]: { name: DEFAULT_PLAYER_NAMES[SYMBOL_2], isComputer: false },
    });
    const [moves, setMoves] = useState([
        { row: 0, col: 0, symbol: "X" },
        { row: 1, col: 1, symbol: "O" },
        { row: 0, col: 1, symbol: "X" },
        { row: 0, col: 2, symbol: "O" },
    ]);
    const activePlayerSymbol = moves.length % 2 === 0 ? SYMBOL_1 : SYMBOL_2;
    const winningMoves = getWinner(moves);
    const winnerName =
        winningMoves.length > 0
            ? players[winningMoves[0][0].symbol].name
            : null;
    const gameDrawn = moves.length === 9 && winnerName === null;

    function handleUpdateName(symbol, newName) {
        if (newName) {
            setPlayers((players) => ({
                ...players,
                [symbol]: { ...players[symbol], name: newName },
            }));
        }
    }

    function handleSelectEmptySquare(row, col) {
        setMoves((prevMoves) => {
            let currentPlayerSymbol =
                prevMoves.length % 2 === 0 ? SYMBOL_1 : SYMBOL_2;
            return [...prevMoves, { row, col, symbol: currentPlayerSymbol }];
        });
    }

    function handleResetTo(move) {
        setMoves((prevMoves) => prevMoves.slice(0, move));
    }

    function handleSwitchPlayerType(symbol) {
        if (players[symbol].isComputer) {
            setPlayers((players) => ({
                ...players,
                [symbol]: {
                    name: DEFAULT_PLAYER_NAMES[symbol],
                    isComputer: false,
                },
            }));
        } else {
            setPlayers((players) => ({
                ...players,
                [symbol]: {
                    name: COMPUTER_TYPES[0],
                    isComputer: true,
                },
            }));
        }
        setMoves([]);
    }

    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    <Player
                        name={players[SYMBOL_1].name}
                        onUpdateName={handleUpdateName}
                        symbol={SYMBOL_1}
                        isActive={activePlayerSymbol === SYMBOL_1}
                        computerTypes={
                            players[SYMBOL_1].isComputer && COMPUTER_TYPES
                        }
                    />
                    <Player
                        name={players[SYMBOL_2].name}
                        onUpdateName={handleUpdateName}
                        symbol={SYMBOL_2}
                        isActive={activePlayerSymbol === SYMBOL_2}
                        computerTypes={
                            players[SYMBOL_2].isComputer && COMPUTER_TYPES
                        }
                        rtl={true}
                    />
                </ol>
                <div id="player-type-controller">
                    <button onClick={() => handleSwitchPlayerType(SYMBOL_1)}>
                        Switch to{" "}
                        <strong>
                            {players[SYMBOL_1].isComputer
                                ? "human"
                                : "computer"}
                        </strong>{" "}
                        player
                    </button>
                    <button onClick={() => handleSwitchPlayerType(SYMBOL_2)}>
                        Switch to{" "}
                        <strong>
                            {players[SYMBOL_2].isComputer
                                ? "human"
                                : "computer"}
                        </strong>{" "}
                        player
                    </button>
                </div>
                {(winnerName || gameDrawn) && (
                    <GameOver
                        winnerName={winnerName}
                        onRestart={() => handleResetTo(0)}
                    />
                )}
                <GameBoard
                    moves={moves}
                    onSelectEmptySquare={handleSelectEmptySquare}
                />
            </div>
            <Log moves={moves} onResetTo={handleResetTo} />
        </main>
    );
}

export default App;
