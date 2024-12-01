let socket;
let roomId = null; // ID da sala
let currentCanvasState = null; // Estado atual do canvas

// Cria a nova sala
document.querySelectorAll(".btn_new_roon").forEach((button) => {
  button.addEventListener("click", () => {
    if (!socket || socket.disconnected) {
      socket = io(); // Conectar ao servidor Socket.IO

      // Criar a sala no servidor
      createRoom();
    }
  });
});

// Desconectar ao clicar em qualquer botão do menu
document.querySelectorAll(".menu_nav_btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  });
});

// Função para criar uma nova sala
function createRoom() {
  socket.emit("create_room", (response) => { // Callback para receber a resposta
    
    if (response.success) {
      roomId = response.roomId;
      console.log(`Sala criada com sucesso: ${roomId}`);
      // Entrar na sala criada
      console.log(roomId)
      joinRoom(roomId);

    } else {
      console.log(response.message);
    }
  });
  
}

// Função para entrar em uma sala existente
function joinRoom(existingRoomId) {
  if (!socket || !socket.connected) {
    console.log("Socket não está conectado. Reconectando...");
    socket = io(); // Reconectar ao servidor Socket.IO se o socket não estiver conectado
  }

  socket.on("availableRooms", (rooms) => {
    console.log("Available rooms:", rooms);
});

  socket.emit("join_room", existingRoomId, (response) => {
    if (response.success) {
      roomId = existingRoomId;
      console.log(`Entrou na sala ${roomId}`);

      // Recebe o estado inicial do canvas (se houver)
      socket.on("initial_canvas_state", (state) => {
        currentCanvasState = state;
        if (currentCanvasState) {
          restoreCanvas(currentCanvasState);
        }
      });
    } else {
      console.log(response.message);
    }
  });
}

// Função para restaurar o estado do canvas com a imagem recebida
function restoreCanvas(state) {
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = state; // A imagem em base64 recebida
  img.onload = () => {
    ctx.drawImage(img, 0, 0); // Restaura a imagem no canvas
  };
}