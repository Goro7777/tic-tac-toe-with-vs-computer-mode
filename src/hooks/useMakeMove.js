import { useEffect } from "react";

export function useMakeMove(
    enabled,
    moves,
    setMoves,
    players,
    computers,
    symbol1,
    symbol2
) {
    useEffect(() => {
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
    }, [enabled, moves, players]);
}
