const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

const inputColor = document.querySelector(".input_color");
const tools = document.querySelectorAll(".button_tool");
const sizeButtons = document.querySelectorAll(".button_size");
const buttonClear = document.querySelector(".button_clear");

let brushSize = 5;
let isPainting = false;
let activeTool = "brush";

// Ajusta o tamanho do canvas2
function resizecanvas2() {
  canvas2.width = canvas2.offsetWidth;
  canvas2.height = canvas2.offsetHeight;
}
resizecanvas2();
window.addEventListener("resize", resizecanvas2);

// Define a cor do pincel
inputColor.addEventListener("change", ({ target }) => {
  ctx2.fillStyle = target.value;
  ctx2.strokeStyle = target.value;
});

// Eventos para pintar e apagar
canvas2.addEventListener("mousedown", ({ clientX, clientY }) => {
  isPainting = true;
  if (activeTool === "brush") draw(clientX, clientY);
  if (activeTool === "rubber") erase(clientX, clientY);
});

canvas2.addEventListener("mousemove", ({ clientX, clientY }) => {
  if (!isPainting) return;
  if (activeTool === "brush") draw(clientX, clientY);
  if (activeTool === "rubber") erase(clientX, clientY);
});

canvas2.addEventListener("mouseup", () => {
  isPainting = false;
  ctx2.beginPath(); // Reinicia o caminho
});

// Função de desenho
const draw = (x, y) => {
  const rect = canvas2.getBoundingClientRect();
  ctx2.globalCompositeOperation = "source-over";
  ctx2.lineWidth = brushSize;
  ctx2.lineCap = "round";
  ctx2.lineTo(x - rect.left, y - rect.top);
  ctx2.stroke();
  ctx2.beginPath();
  ctx2.moveTo(x - rect.left, y - rect.top);
};

// Função de borracha
const erase = (x, y) => {
  const rect = canvas2.getBoundingClientRect();
  ctx2.globalCompositeOperation = "destination-out";
  ctx2.beginPath();
  ctx2.arc(x - rect.left, y - rect.top, brushSize / 2, 0, 2 * Math.PI);
  ctx2.fill();
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

// Limpa o canvas2
buttonClear.addEventListener("click", () => {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
});

// Adiciona eventos aos botões
tools.forEach((tool) => tool.addEventListener("click", selectTool));
sizeButtons.forEach((button) => button.addEventListener("click", selectSize));
