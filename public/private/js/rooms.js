var sections = document.querySelectorAll(".main_section, #transition_section");

function showRooms() {
  const roomsContainer = document.getElementById("rooms");

  listRooms()
    .then(() => {
      const rooms = sessionStorage.rooms
        ? JSON.parse(sessionStorage.rooms)
        : [];

      if (rooms.length === 0) {
        roomsContainer.innerHTML = "Nenhuma sala disponível.";
      } else {
        // Atualiza o conteúdo com as salas
        roomsContainer.innerHTML = rooms
          .map(
            (room) => `
            <div 
              onclick="setRoonsButoons('${room.codRoom}')" 
              class="room" 
              data-idRoom="${room.codRoom}">
              <span>Sala: ${room.codRoom}</span>
              <span>Jogadores: ${room.qtdUsers}</span>
            </div>
          `
          )
          .join("");
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar as salas:", error);
      roomsContainer.innerHTML = "Erro ao carregar as salas.";
    });
}

function setRoonsButoons(codRoom) {
  
  if (!socket || !socket.connected) {
    console.log("Socket não está conectado. Reconectando...");
    socket = io(); // Reconectar ao servidor Socket.IO se o socket não estiver conectado
  }

  socket.on("availableRooms", (rooms) => {
    console.log("Available rooms:", rooms);
  });

  connectAndJoinRoom(codRoom)

  socket.emit("join_room", codRoom, (response) => {
    if (response.success) {
      roomId = codRoom;
      console.log(`Entrou na sala ${roomId}`);

      configureScreenExibition(
        document.querySelectorAll(".main_section, #transition_section"),
        "play_section",
        0
      );

      // // Recebe o estado inicial do canvas (se houver)
      // socket.on("initial_canvas_state", (state) => {
      //   currentCanvasState = state;
      //   if (currentCanvasState) {
      //     restoreCanvas(currentCanvasState);
      //   }
      // });
    } else {
      console.log(response.message);
    }
  });
}






function listRooms() {
  return fetch("/rooms/listRooms", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resposta) {
      if (resposta.ok) {
        return resposta.json().then((json) => {
          if (json.rooms) {
            sessionStorage.rooms = JSON.stringify(json.rooms);
          } else {
            console.error("O campo 'rooms' não foi encontrado na resposta");
          }
        });
      } else {
        console.error("Erro na resposta");
      }
    })
    .catch(function (erro) {
      console.log("Erro na requisição:", erro);
    });
}
