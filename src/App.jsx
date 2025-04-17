import { useState } from "react";
import Player from "./components/Player";

const SYMBOL_1 = "X";
const SYMBOL_2 = "O";

function App() {
    const [playerNames, setPlayerNames] = useState({
        [SYMBOL_1]: "Player 1",
        [SYMBOL_2]: "Player 2",
    });

    function handleUpdateName(symbol, newName) {
        setPlayerNames((names) => ({
            ...names,
            [symbol]: newName,
        }));
    }

    console.log(`${playerNames[SYMBOL_1]} vs ${playerNames[SYMBOL_2]}`);

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
                GOAME BOARD
            </div>
        </main>
    );
}

export default App;
