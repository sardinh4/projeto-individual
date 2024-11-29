// Configuração do Socket.IO
const socket = io("http://localhost:3333");

let salaAtual = null;

// Reconectar ao servidor e solicitar entrada na última sala
socket.on("connect", () => {
    console.log("Conectado ao servidor.");
    socket.emit("entrarNaSala", salaAtual); // Tenta reconectar à sala anterior
});

// Receber confirmação de entrada na sala
socket.on("salaConfirmada", (sala) => {
    salaAtual = sala;
    console.log(`Você entrou na sala ${sala}`);
});

// Atualizar o canvas com eventos recebidos
socket.on("desenharNoCanvas", ({ x, y, desenharDeFato, tool, size, color }) => {
    canvasHandlers.atualizarDesenhoViaSocket(x, y, desenharDeFato, tool, size, color);
});

socket.on("limparCanvas", () => {
    canvasHandlers.limparCanvas();
});

socket.on("atualizarCanvas", (historico) => {
    historico.forEach(({ x, y, desenharDeFato, tool, size, color }) => {
        canvasHandlers.atualizarDesenhoViaSocket(x, y, desenharDeFato, tool, size, color);
    });
});

// Emissão de eventos para o servidor
const socketHandlers = {
    emitirDesenho: (x, y, desenharDeFato, tool, size, color) => {
        socket.emit("desenhar", { x, y, desenharDeFato, tool, size, color }, salaAtual);
    },

    limparCanvas: () => {
        socket.emit("limparCanvas", salaAtual);
    },
};
