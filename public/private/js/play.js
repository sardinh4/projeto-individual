const socket = io("http://localhost:3333");  // Ou o endereço correto do servidor
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const toggleDrawButton = document.getElementById('toggleDraw');

let desenhando = false;
let permissaoDesenhar = false;
let salaAtual = null;

// Solicita entrar em uma sala
socket.emit('entrarNaSala', null);

// Eventos de canvas para desenhar
canvas.addEventListener('mousedown', (e) => {
  if (!permissaoDesenhar) return;
  desenhando = true;
  desenhar(e.offsetX, e.offsetY, false);
});

canvas.addEventListener('mouseup', () => {
  desenhando = false;
  ctx.beginPath();
});

canvas.addEventListener('mousemove', (e) => {
  if (!desenhando || !permissaoDesenhar) return;
  desenhar(e.offsetX, e.offsetY, true);
});

// Função para desenhar no canvas
function desenhar(x, y, desenharDeFato) {
  if (desenharDeFato) {
    ctx.lineTo(x, y);
    ctx.stroke();
  } else {
    ctx.moveTo(x, y);
  }
  socket.emit('desenhar', { x, y, desenharDeFato }, salaAtual);
}

// Recebe atualizações de desenho
socket.on('desenharNoCanvas', (data) => {
  desenhar(data.x, data.y, data.desenharDeFato);
});

// Recebe o histórico de desenhos ao entrar na sala
socket.on('atualizarCanvas', (historico) => {
  historico.forEach((data) => {
    desenhar(data.x, data.y, data.desenharDeFato);
  });
});

// Atualiza a permissão para desenhar
socket.on('permissaoDesenho', (idDesenhador) => {
  permissaoDesenhar = socket.id === idDesenhador;
  toggleDrawButton.textContent = permissaoDesenhar
    ? 'Você está desenhando'
    : 'Tornar-se Desenhador';
});

// // Envia solicitação para alternar o desenhador
// toggleDrawButton.addEventListener('click', () => {
//   socket.emit('trocarDesenhador', salaAtual);
// });

// Atualiza a sala ao entrar
socket.on('salaConfirmada', (sala) => {
  salaAtual = sala;
  console.log(`Você entrou na sala ${sala}`);
});
