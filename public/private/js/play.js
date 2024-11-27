const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const inputColor = document.querySelector(".input__color");
const tools = document.querySelectorAll(".button__tool");
const sizeButtons = document.querySelectorAll(".button__size");
const buttonClear = document.querySelector(".button__clear");
const toggleDrawButton = document.getElementById("toggleDraw");

let desenhando = false;
let permissaoDesenhar = false;
let salaAtual = null;
let activeTool = "brush";
let brushSize = 20;
let lastPos = null;

// Ajusta o tamanho do canvas
function ajustarCanvas() {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
}

// Inicializa o canvas
ajustarCanvas();
window.addEventListener("resize", ajustarCanvas);

// Socket.io configuração
const socket = io("http://localhost:3333");

// Solicita entrada em uma sala
socket.emit("entrarNaSala", null);

// Eventos de ferramenta
inputColor.addEventListener("change", ({ target }) => {
    ctx.fillStyle = target.value;
    ctx.strokeStyle = target.value;
});

tools.forEach((tool) => {
    tool.addEventListener("click", ({ target }) => {
        const selectedTool = target.closest("button");
        const action = selectedTool.getAttribute("data-action");

        if (action) {
            tools.forEach((tool) => tool.classList.remove("active"));
            selectedTool.classList.add("active");
            activeTool = action;
        }
    });
});

sizeButtons.forEach((button) => {
    button.addEventListener("click", ({ target }) => {
        const selectedTool = target.closest("button");
        const size = selectedTool.value;

        sizeButtons.forEach((tool) => tool.classList.remove("active"));
        selectedTool.classList.add("active");
        brushSize = size;
        ctx.lineWidth = brushSize;
    });
});

// Função para desenhar ou apagar
const desenhar = (x, y, desenharDeFato) => {
    if (!desenharDeFato || !lastPos) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Atualiza a última posição
    lastPos = { x, y };

    // Envia dados via socket
    socket.emit(
        "desenhar",
        { x, y, desenharDeFato, tool: activeTool, size: brushSize, color: ctx.strokeStyle },
        salaAtual
    );
};

const apagar = (x, y, apagarDeFato) => {
    const prevOperation = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "destination-out"; // Modo para apagar

    desenhar(x, y, apagarDeFato);

    ctx.globalCompositeOperation = prevOperation; // Restaura o modo original
};

const apagarCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("limparCanvas", salaAtual);
};

// Eventos de desenho no canvas
canvas.addEventListener("mousedown", (event) => {
    if (!permissaoDesenhar) return;
    desenhando = true;
    const pos = getMousePos(event);

    if (activeTool === "brush") desenhar(pos.x, pos.y, false);
    if (activeTool === "rubber") apagar(pos.x, pos.y, false);
});

canvas.addEventListener("mousemove", (event) => {
    if (!desenhando || !permissaoDesenhar) return;
    const pos = getMousePos(event);

    if (activeTool === "brush") desenhar(pos.x, pos.y, true);
    if (activeTool === "rubber") apagar(pos.x, pos.y, true);
});

canvas.addEventListener("mouseup", () => {
    desenhando = false;
    lastPos = null;
});

buttonClear.addEventListener("click", apagarCanvas);

// Atualizações via socket
socket.on("desenharNoCanvas", ({ x, y, desenharDeFato, tool, size, color }) => {
    const prevTool = activeTool;
    const prevSize = brushSize;
    const prevColor = ctx.strokeStyle;

    activeTool = tool;
    brushSize = size;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    if (tool === "brush") desenhar(x, y, desenharDeFato);
    if (tool === "rubber") apagar(x, y, desenharDeFato);

    activeTool = prevTool;
    brushSize = prevSize;
    ctx.strokeStyle = prevColor;
});

socket.on("limparCanvas", apagarCanvas);

socket.on("permissaoDesenho", (idDesenhador) => {
    permissaoDesenhar = socket.id === idDesenhador;
    toggleDrawButton.textContent = permissaoDesenhar ? "Você está desenhando" : "Tornar-se Desenhador";
});

socket.on("atualizarCanvas", (historico) => {
    historico.forEach(({ x, y, desenharDeFato, tool, size, color }) => {
        const prevTool = activeTool;
        const prevSize = brushSize;
        const prevColor = ctx.strokeStyle;

        activeTool = tool;
        brushSize = size;
        ctx.strokeStyle = color;
        ctx.lineWidth = size;

        if (tool === "brush") desenhar(x, y, desenharDeFato);
        if (tool === "rubber") apagar(x, y, desenharDeFato);

        activeTool = prevTool;
        brushSize = prevSize;
        ctx.strokeStyle = prevColor;
    });
});

socket.on("salaConfirmada", (sala) => {
    salaAtual = sala;
    console.log(`Você entrou na sala ${sala}`);
});

// Alterna o desenhador
toggleDrawButton.addEventListener("click", () => {
    socket.emit("trocarDesenhador", salaAtual);
});

// Obtem posição do mouse no canvas
function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}
