import { getPostData } from "../util/getData.js";
import {
    getWeekComputerMove,
    getMediumComputerMove,
    getStrongComputerMove,
} from "../gameLogic.js";
import {
    verifyDifficulty,
    verifySymbols,
    verifyMoves,
} from "../util/validation.js";

const COMPUTERS = [
    getWeekComputerMove,
    getMediumComputerMove,
    getStrongComputerMove,
];

export async function getMove(req, res) {
    try {
        const body = await getPostData(req);
        const { moves, symbol1, symbol2, difficulty } = JSON.parse(body);

        verifyDifficulty(difficulty, COMPUTERS);
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
