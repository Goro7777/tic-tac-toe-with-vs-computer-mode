import { createServer } from "http";
import {
    getWeekComputerMove,
    getMediumComputerMove,
    getStrongComputerMove,
} from "./gameLogic.js";

const COMPUTERS = [
    getWeekComputerMove,
    getMediumComputerMove,
    getStrongComputerMove,
];

const server = createServer((req, res) => {
    if (req.url === "/getMove" && req.method === "POST") {
        getMove(req, res);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Cannot make a move" }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function getMove(req, res) {
    try {
        const body = await getPostData(req);
        const { moves, symbol1, symbol2, difficulty } = JSON.parse(body);

        verifyDifficulty(difficulty);
        verifySymbols(symbol1, symbol2);
        verifyMoves(moves, symbol1, symbol2);

        let move = COMPUTERS[difficulty](moves, symbol1, symbol2);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(move));
    } catch (error) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: error.message }));
    }
}

function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";

            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                resolve(body);
            });
        } catch (err) {
            reject(err);
        }
    });
}

function verifySymbols(symbol1, symbol2) {
    if (!symbol1 || !symbol2 || symbol1[0] === symbol2[0]) {
        throw new Error("Symbols are in incorrect format");
    }
    return true;
}

function verifyDifficulty(difficulty) {
    if (difficulty < 0 || difficulty >= COMPUTERS.length) {
        throw new Error("Difficulty is out of range");
    }
    return true;
}

function verifyMoves(moves, symbol1, symbol2) {
    if (moves.length >= 9) throw new Error("Moves are in incorrect format");
    let cellsPlayed = new Set();

    for (let i = 0; i < moves.length; i++) {
        if (
            moves[i].row === undefined ||
            moves[i].col === undefined ||
            moves[i].row < 0 ||
            moves[i].row > 2 ||
            moves[i].col < 0 ||
            moves[i].col > 2
        )
            throw new Error("Moves are in incorrect format");

        let cell = moves[i].row + "-" + moves[i].col;
        if (cellsPlayed.has(cell))
            throw new Error("Moves are in incorrect format");
        cellsPlayed.add(cell);

        let symbol = i % 2 === 0 ? symbol1 : symbol2;
        if (moves[i].symbol !== symbol)
            throw new Error("Moves are in incorrect format");
    }
    return true;
}
