import { useEffect, useState } from "react";

export function useMakeMove(
    enabled,
    moves,
    setMoves,
    players,
    computers,
    symbol1,
    symbol2,
    delay
) {
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        if (!enabled) return;

        const activePlayerSymbol = moves.length % 2 === 0 ? symbol1 : symbol2;
        let difficulty = computers.findIndex(
            (name) => name === players[activePlayerSymbol].name
        );
        let fetchBody = {
            moves,
            difficulty,
            symbol1,
            symbol2,
        };

        fetch("http://localhost:3000/getMove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fetchBody),
        })
            .then((response) => {
                if (response.status !== 200) {
                    return response.json().then((error) => {
                        throw error;
                    });
                } else {
                    return response.json();
                }
            })
            .then((nextMove) => {
                return new Promise(() => {
                    setTimeout(
                        () => setMoves((prevMoves) => [...prevMoves, nextMove]),
                        delay
                    );
                });
            })
            .catch((error) => {
                setError({
                    message: error.message || "Computer cannot make a move",
                });
            });
    }, [enabled, moves, players]);

    return error;
}
