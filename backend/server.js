import { createServer } from "http";
import { getMove } from "./controllers/moveController.js";

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
