let socket;

let roomId = null; // ID da sala
let currentCanvasState = null; // Estado atual do canvas (será atualizado com os dados do servidor)


document.querySelectorAll(".btn_new_roon").forEach((button) => {
  button.addEventListener("click", () => {
    if (!socket || socket.disconnected) {
      socket = io(); // Conectar ao servidor Socket.IO

      createRoom()

      // Escutar o evento 'initial_canvas_state' para receber o estado inicial do canvas
      socket.on("initial_canvas_state", (data) => {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = data; // A imagem em base64 recebida
        img.onload = () => {
          ctx.drawImage(img, 0, 0); // Desenha a imagem recebida no canvas
        };
      });


      // Escutar eventos do canvas para atualizações de outros usuários
      socket.on("draw_data", (data) => {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = data;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
      });
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
function createRoom(newRoomId) {

  fetch("/rooms/createRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        console.log(
          "Nova sala criada"
        );
        resposta.json().then(json => {
          console.log(json);
          console.log(JSON.stringify(json));
          var newRoomId = JSON.stringify(json.idRoom);
          
          socket.emit('create_room', newRoomId, (response) => {
            if (response.success) {
              roomId = newRoomId;
              console.log(`Sala criada com sucesso: ${roomId}`);
              // Recebe o estado do canvas inicial (se houver)
              if (response.roomId) {
                socket.emit('join_room', roomId, (joinResponse) => {
                  if (joinResponse.success) {
                    console.log(`Entrou na sala ${roomId}`);
                    // Recebe o estado inicial do canvas (se houver)
                    socket.on('initial_canvas_state', (state) => {
                      currentCanvasState = state;
                      if (currentCanvasState) {
                        restoreCanvas(currentCanvasState);
                      }
                    });
                  } else {
                    console.log('Erro ao entrar na sala');
                  }
                });
              }
            } else {
              console.log(response.message);
            }
          });
          
      });
        
      } else {
        throw "Houve um erro ao tentar criar uma nova sala!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });
  
}

// Função para entrar em uma sala existente
function joinRoom(existingRoomId) {
  socket.emit('join_room', existingRoomId, (response) => {
    if (response.success) {
      roomId = existingRoomId;
      console.log(`Entrou na sala ${roomId}`);
      // Recebe o estado inicial do canvas (se houver)
      socket.on('initial_canvas_state', (state) => {
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


