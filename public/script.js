// Redirection depuis index.html vers chat.html
document.addEventListener("DOMContentLoaded", () => {
    const joinButton = document.getElementById("joinButton");
    if (joinButton) {
        joinButton.addEventListener("click", () => {
            const username = document.getElementById("username").value.trim();
            if (username) {
                window.location.href = `chat.html?username=${encodeURIComponent(username)}`;
            } else {
                alert("Veuillez entrer un pseudonyme !");
            }
        });
    }

    // Gestion du chat dans chat.html
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");

    if (username) {
        document.getElementById("usernameDisplay").textContent = username;
        const ws = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host);
        const status = document.getElementById("status");
        const messageInput = document.getElementById("messageInput");
        const sendButton = document.getElementById("sendButton");
        const messagesList = document.getElementById("messages");

        ws.onopen = () => status.textContent = "🟢 Connecté au serveur";
        ws.onclose = () => status.textContent = "🔴 Déconnecté";
        ws.onmessage = (event) => {
            console.log("Message reçu :", event.data);
            const li = document.createElement("li");
            li.textContent = event.data;
            messagesList.appendChild(li);
        };

        sendButton.addEventListener("click", () => {
            const message = messageInput.value.trim();
            if (message) {
                ws.send(`${username}: ${message}`);  // Envoi du pseudo avec le message
                messageInput.value = "";
            }
        });

        document.addEventListener("DOMContentLoaded", () => {
            const params = new URLSearchParams(window.location.search);
            const username = params.get("username");
            const storedUsername = localStorage.getItem("username");
        
            if (username && storedUsername !== username) {
                alert("❌ Erreur : Le pseudo ne correspond pas à celui en mémoire !");
                window.location.href = "index.html";  // Redirection vers l'accueil
                return;
            }
        
            if (username) {
                document.getElementById("usernameDisplay").textContent = username;
                const ws = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host);
                const status = document.getElementById("status");
                const messageInput = document.getElementById("messageInput");
                const sendButton = document.getElementById("sendButton");
                const messagesList = document.getElementById("messages");
        
                ws.onopen = () => status.textContent = "🟢 Connecté au serveur";
                ws.onclose = () => status.textContent = "🔴 Déconnecté";
                ws.onmessage = (event) => {
                    console.log("Message reçu :", event.data);
                    const li = document.createElement("li");
                    li.textContent = event.data;
                    messagesList.appendChild(li);
                };
        
                sendButton.addEventListener("click", () => {
                    const message = messageInput.value.trim();
                    if (message) {
                        ws.send(`${username}: ${message}`);
                        messageInput.value = "";
                    }
                });
        
                messageInput.addEventListener("keypress", (event) => {
                    if (event.key === "Enter") sendButton.click();
                });
        
                // Supprime le pseudo à la fermeture de la page
                window.addEventListener("beforeunload", () => {
                    localStorage.removeItem("username");
                });
            }
        });

        messageInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") sendButton.click();
        });
    }
});
