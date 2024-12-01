var sections = document.querySelectorAll(
  ".main_section, #transition_section"
);


function showRooms() {
  const roomsContainer = document.getElementById("rooms");

  listRooms()
    .then(() => {
      const rooms = sessionStorage.rooms ? JSON.parse(sessionStorage.rooms) : [];

      if (rooms.length === 0) {
        roomsContainer.innerHTML = "Nenhuma sala disponível.";
      } else {
        // Atualiza o conteúdo com as salas
        roomsContainer.innerHTML = rooms
          .map((room) => `
            <div 
              onclick="joinRoom(${room.idRoom}); configureScreenExibition(
                document.querySelectorAll('.main_section, #transition_section'), 
                'play_section', 0);" 
              class="room" 
              data-idRoom="${room.idRoom}">
              <span>Sala: ${room.idRoom}</span>
              <span>Jogadores: ${room.qtdUsers}</span>
            </div>
          `)
          .join('');
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar as salas:", error);
      roomsContainer.innerHTML = "Erro ao carregar as salas.";
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
