// const canvas = document.querySelector("canvas");
// const ctx = canvas.getContext("2d");

// const inputColor = document.querySelector(".input__color");
// const tools = document.querySelectorAll(".button__tool");
// const sizeButtons = document.querySelectorAll(".button__size");
// const buttonClear = document.querySelector(".button__clear");

// let desenhando = false;
// let permissaoDesenhar = false;
// let activeTool = "brush";
// let brushSize = 20;
// let lastPos = null;

// // Ajusta o tamanho do canvas
// function ajustarCanvas() {
//     const { width, height } = canvas.getBoundingClientRect();
//     canvas.width = width;
//     canvas.height = height;

//     ctx.lineJoin = "round";
//     ctx.lineCap = "round";
//     ctx.lineWidth = brushSize;
//     ctx.strokeStyle = "black";
//     ctx.fillStyle = "black";
// }

// // Inicializa o canvas
// ajustarCanvas();
// window.addEventListener("resize", ajustarCanvas);

// // Eventos do Canvas para desenho
// canvas.addEventListener("mousedown", (event) => {
//     if (!permissaoDesenhar) return;
//     desenhando = true;
//     const pos = getMousePos(event);

//     if (activeTool === "brush") desenhar(pos.x, pos.y, false);
//     if (activeTool === "rubber") apagar(pos.x, pos.y, false);
// });

// canvas.addEventListener("mousemove", (event) => {
//     if (!desenhando || !permissaoDesenhar) return;
//     const pos = getMousePos(event);

//     if (activeTool === "brush") desenhar(pos.x, pos.y, true);
//     if (activeTool === "rubber") apagar(pos.x, pos.y, true);
// });

// canvas.addEventListener("mouseup", () => {
//     desenhando = false;
//     lastPos = null;
// });

// // Eventos de ferramentas
// inputColor.addEventListener("change", ({ target }) => {
//     ctx.fillStyle = target.value;
//     ctx.strokeStyle = target.value;
// });

// tools.forEach((tool) => {
//     tool.addEventListener("click", ({ target }) => {
//         const selectedTool = target.closest("button");
//         const action = selectedTool.getAttribute("data-action");

//         if (action) {
//             tools.forEach((tool) => tool.classList.remove("active"));
//             selectedTool.classList.add("active");
//             activeTool = action;
//         }
//     });
// });

// sizeButtons.forEach((button) => {
//     button.addEventListener("click", ({ target }) => {
//         const selectedTool = target.closest("button");
//         const size = parseInt(selectedTool.value, 10);

//         sizeButtons.forEach((tool) => tool.classList.remove("active"));
//         selectedTool.classList.add("active");
//         brushSize = size;
//         ctx.lineWidth = brushSize;
//     });
// });

// buttonClear.addEventListener("click", () => {
//     canvasHandlers.limparCanvas();
//     socketHandlers.limparCanvas();
// });

// // Funções de desenho e apagar
// function desenhar(x, y, desenharDeFato) {
//     if (!desenharDeFato || !lastPos) {
//         ctx.beginPath();
//         ctx.moveTo(x, y);
//     } else {
//         ctx.lineTo(x, y);
//         ctx.stroke();
//     }

//     lastPos = { x, y };

//     socketHandlers.emitirDesenho(x, y, desenharDeFato, activeTool, brushSize, ctx.strokeStyle);
// }

// function apagar(x, y, apagarDeFato) {
//     const prevOperation = ctx.globalCompositeOperation;
//     ctx.globalCompositeOperation = "destination-out";

//     desenhar(x, y, apagarDeFato);

//     ctx.globalCompositeOperation = prevOperation;
// }

// function limparCanvas() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

// // Obter posição do mouse no canvas
// function getMousePos(event) {
//     const rect = canvas.getBoundingClientRect();
//     return {
//         x: event.clientX - rect.left,
//         y: event.clientY - rect.top,
//     };
// }

// // Handlers de canvas para atualizações via Socket.IO
// const canvasHandlers = {
//     atualizarDesenhoViaSocket: (x, y, desenharDeFato, tool, size, color) => {
//         const prevTool = activeTool;
//         const prevSize = brushSize;
//         const prevColor = ctx.strokeStyle;

//         activeTool = tool;
//         brushSize = size;
//         ctx.strokeStyle = color;
//         ctx.lineWidth = size;

//         if (tool === "brush") desenhar(x, y, desenharDeFato);
//         if (tool === "rubber") apagar(x, y, desenharDeFato);

//         activeTool = prevTool;
//         brushSize = prevSize;
//         ctx.strokeStyle = prevColor;
//     },

//     limparCanvas: limparCanvas,
// };


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Função para ajustar o tamanho do canvas conforme o tamanho da tela
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// Inicializa o tamanho do canvas
resizeCanvas();

// Ajusta o tamanho do canvas quando a tela for redimensionada
window.addEventListener('resize', resizeCanvas);

let drawing = false;

// Eventos de desenho
canvas.addEventListener('mousedown', () => { drawing = true; });
canvas.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
canvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Emitir dados do canvas
    if (socket && socket.connected) {
        const dataURL = canvas.toDataURL();
        socket.emit('draw_data', dataURL);
    }
}
