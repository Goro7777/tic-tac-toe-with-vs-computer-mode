import { useState, useEffect } from "react";

import Player from "./components/Player";
import PlayerTypeController from "./components/PlayerTypeController.jsx";
import GameBoard from "./components/GameBoard";
import GameOver from "./components/GameOver.jsx";
import Log from "./components/Log.jsx";

import { checkGameIsLost } from "./gameLogic.js";

const SYMBOL_1 = "X";
const SYMBOL_2 = "O";

const DEFAULT_PLAYER_NAMES = {
    [SYMBOL_1]: "Player 1",
    [SYMBOL_2]: "Player 2",
};

const COMPUTERS = ["Week computer", "Medium computer", "Strong computer"];

// const COMPUTER_MOVE_DELAY = 1000;

function App() {
    const [players, setPlayers] = useState({
        [SYMBOL_1]: { name: DEFAULT_PLAYER_NAMES[SYMBOL_1], isComputer: false },
        [SYMBOL_2]: { name: DEFAULT_PLAYER_NAMES[SYMBOL_2], isComputer: false },
    });
    const [moves, setMoves] = useState([]);

    const activePlayerSymbol = moves.length % 2 === 0 ? SYMBOL_1 : SYMBOL_2;
    const gameIsLost = checkGameIsLost(moves);
    const gameIsOver = gameIsLost || moves.length === 9;
    const winnerName = gameIsLost
        ? players[moves[moves.length - 1].symbol].name
        : null;

    useEffect(() => {
        if (!players[activePlayerSymbol].isComputer || gameIsOver) return;

        let difficulty = COMPUTERS.findIndex(
            (name) => name === players[activePlayerSymbol].name
        );
        let fetchBody = {
            moves,
            difficulty,
            symbol1: SYMBOL_1,
            symbol2: SYMBOL_2,
        };

        fetch("http://localhost:3000/getMove", {
            method: "POST",
            body: JSON.stringify(fetchBody),
        })
            .then((response) => {
                return response.json();
            })
            .then((nextMove) => {
                setMoves((prevMoves) => [...prevMoves, nextMove]);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [players, gameIsOver, moves]);

    function handleUpdateName(symbol, newName) {
        if (newName) {
            setPlayers((players) => ({
                ...players,
                [symbol]: { ...players[symbol], name: newName },
            }));
            handleResetTo(0);
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
                    name: COMPUTERS[0],
                    isComputer: true,
                },
            }));
        }
        handleResetTo(0);
    }

    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    <Player
                        key={players[SYMBOL_1].name + "0"}
                        name={players[SYMBOL_1].name}
                        onUpdateName={handleUpdateName}
                        symbol={SYMBOL_1}
                        isActive={activePlayerSymbol === SYMBOL_1}
                        computerTypes={
                            players[SYMBOL_1].isComputer && COMPUTERS
                        }
                    />
                    <Player
                        key={players[SYMBOL_2].name + "1"}
                        name={players[SYMBOL_2].name}
                        onUpdateName={handleUpdateName}
                        symbol={SYMBOL_2}
                        isActive={activePlayerSymbol === SYMBOL_2}
                        computerTypes={
                            players[SYMBOL_2].isComputer && COMPUTERS
                        }
                        reverseOrder={true}
                    />
                </ol>
                <div id="player-type-controllers">
                    <PlayerTypeController
                        onSwitchType={() => handleSwitchPlayerType(SYMBOL_1)}
                        isComputer={players[SYMBOL_1].isComputer}
                    />
                    <PlayerTypeController
                        onSwitchType={() => handleSwitchPlayerType(SYMBOL_2)}
                        isComputer={players[SYMBOL_2].isComputer}
                    />
                </div>
                {gameIsOver && (
                    <GameOver
                        winnerName={winnerName}
                        onRestart={() => handleResetTo(0)}
                    />
                )}
                <GameBoard
                    moves={moves}
                    onSelectEmptySquare={handleSelectEmptySquare}
                    computerIsPlaying={players[activePlayerSymbol].isComputer}
                    activePlayerSymbol={activePlayerSymbol}
                />
            </div>
            <Log moves={moves} onResetTo={handleResetTo} />
        </main>
    );
}

export default App;
