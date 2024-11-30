const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const inputColor = document.querySelector(".input_color");
const tools = document.querySelectorAll(".button_tool");
const sizeButtons = document.querySelectorAll(".button_size");
const buttonClear = document.querySelector(".button_clear");

let brushSize = 5;
let isPainting = false;
let activeTool = "brush";

// Ajusta o tamanho do canvas
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Define a cor do pincel
inputColor.addEventListener("change", ({ target }) => {
    ctx.fillStyle = target.value;
    ctx.strokeStyle = target.value;
});

// Eventos para pintar e apagar
canvas.addEventListener("mousedown", ({ clientX, clientY }) => {
    isPainting = true;
    if (activeTool === "brush") draw(clientX, clientY);
    if (activeTool === "rubber") erase(clientX, clientY);
});

canvas.addEventListener("mousemove", ({ clientX, clientY }) => {
    if (!isPainting) return;
    if (activeTool === "brush") draw(clientX, clientY);
    if (activeTool === "rubber") erase(clientX, clientY);
});

canvas.addEventListener("mouseup", () => {
    isPainting = false;
    ctx.beginPath(); // Reinicia o caminho
    emitCanvasData(); // Envia os dados do canvas
});

// Função de desenho
const draw = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = "source-over";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineTo(x - rect.left, y - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - rect.left, y - rect.top);
};

// Função de borracha
const erase = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x - rect.left, y - rect.top, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();
};

// Seleção de ferramentas
const selectTool = ({ target }) => {
    const selectedTool = target.closest("button");
    const action = selectedTool.getAttribute("data-action");
    if (action) {
        tools.forEach((tool) => tool.classList.remove("active"));
        selectedTool.classList.add("active");
        activeTool = action;
    }
};

// Seleção de tamanhos
const selectSize = ({ target }) => {
    const selectedTool = target.closest("button");
    const size = selectedTool.value;
    sizeButtons.forEach((tool) => tool.classList.remove("active"));
    selectedTool.classList.add("active");
    brushSize = parseInt(size, 10);
};

// Limpa o canvas
buttonClear.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    emitCanvasData(); // Atualiza os dados do canvas
});

// Emite os dados do canvas via WebSocket

const emitCanvasData = () => {
    if (socket && socket.connected) {
        const dataURL = canvas.toDataURL();
        socket.emit('draw_data', dataURL);
    }
};

// Adiciona eventos aos botões
tools.forEach((tool) => tool.addEventListener("click", selectTool));
sizeButtons.forEach((button) => button.addEventListener("click", selectSize));
