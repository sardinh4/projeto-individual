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



// Conectar e entrar na sala
function connectAndJoinRoom(roomId) {
  socket = io(); // Conectar ao servidor Socket.IO

  socket.on('connect', () => {
    console.log("Conectado ao servidor");
    socket.emit('join_room', roomId, (response) => {
      if (response.success) {
        console.log(`Entrou na sala ${roomId}`);
      } else {
        console.log(response.message);
      }
    });

    // Lidar com atualizações de canvas
    socket.on('canvas_update', (dataURL) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        // Quando a imagem for carregada, desenhe no canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        ctx.drawImage(img, 0, 0); // Desenha a imagem recebida
      };
    });

    // Enviar o estado atual do canvas quando um usuário se conecta (apenas para novos clientes)
    socket.on('initial_canvas_state', (dataURL) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        ctx.drawImage(img, 0, 0); // Desenha o estado inicial
      };
    });
  });

  socket.on('disconnect', () => {
    console.log('Desconectado do servidor!');
  });
}


// Função para criar uma nova sala
function createRoom() {
  socket.emit('create_room', (response) => {
    if (response.success) {
      roomId = response.roomId;
      console.log(`Sala criada com sucesso: ${roomId}`);
      connectAndJoinRoom(roomId); // Conectar e entrar na nova sala
    } else {
      console.log(response.message);
    }
  });
}

// Adiciona evento para criar nova sala
document.querySelectorAll(".btn_new_roon").forEach((button) => {
  button.addEventListener("click", () => {
    if (!socket || socket.disconnected) {
      socket = io(); // Conectar ao servidor Socket.IO

      // Criar a sala no servidor
      createRoom();
    }
  });
});

  
