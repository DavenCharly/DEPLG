import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static("public")); // Servir les fichiers HTML/CSS/JS du client

// Serveur
const server = app.listen(PORT, () => {
    console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
});

// Serveur WebSocket
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("✅ Nouveau joueur connecté");

    ws.on("message", (msg) => {
        console.log("📩 Message reçu :", msg.toString());
        // Broadcast à tous les joueurs
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === ws.OPEN) {
                client.send(msg);
            }
        });
    });

    ws.on("close", () => console.log("❌ Un joueur s'est déconnecté"));
});