function startRoomsInterval() {
    if (!roomsInterval) {
      roomsInterval = setInterval(showRooms, 1000);
    }
  }
  
  function stopRoomsInterval() {
    if (roomsInterval) {
      clearInterval(roomsInterval);
      roomsInterval = null;
    }
  }
  
  function showRooms() {
    // Limpar o conteúdo da seção de salas, mas não apagar as salas já existentes
    const roomsContainer = document.getElementById("rooms");
  
    // Faz a requisição para obter as salas mais recentes do banco
    listRooms()
      .then(() => {
        const rooms = sessionStorage.rooms
          ? JSON.parse(sessionStorage.rooms)
          : [];
        const existingrooms = Array.from(
          roomsContainer.getElementsByClassName("roon")
        );
  
        // Adicionar novas salas
        rooms.forEach((item) => {
          const roomExists = existingrooms.some(
            (existingRoom) => existingRoom.dataset.idRoon === item.idRoon
          );
  
          if (!roomExists) {
            const newRoom = document.createElement("div");
            newRoom.classList.add("roon");
            newRoom.dataset.idRoon = item.idRoon; // Definindo um identificador único para cada sala
            newRoom.innerHTML = `
              <span>Sala: ${item.idRoon}</span>
              <span>Jogadores: ${item.qtdUsers}</span>
            `;
            roomsContainer.appendChild(newRoom);
          }
        });
  
        // Remover salas que não estão mais no banco de dados
        existingrooms.forEach((existingRoom) => {
          const idRoon = existingRoom.dataset.idRoon;
          const roomInDb = rooms.some((item) => item.idRoon === idRoon);
  
          if (!roomInDb) {
            roomsContainer.removeChild(existingRoom);
          }
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar as salas:", error);
        document.getElementById("rooms").innerHTML = "Erro ao carregar as salas.";
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
        console.log("Resposta da requisição:", resposta);
  
        if (resposta.ok) {
          console.log("Resposta OK!");
  
          return resposta.json().then((json) => {
            console.log("Dados recebidos:", json);
  
            // Verifique se o campo rooms existe no JSON
            if (json.rooms) {
              console.log("Salas recebidas:", json.rooms);
              sessionStorage.rooms = JSON.stringify(json.rooms); // Armazenando dados no sessionStorage
              console.log(
                "Dados armazenados no sessionStorage:",
                sessionStorage.rooms
              );
            } else {
              console.error("O campo 'rooms' não foi encontrado na resposta");
            }
          });
        } else {
          console.log("Houve um erro ao tentar listar as salas!");
  
          return resposta.text().then((texto) => {
            console.error("Erro na resposta:", texto);
          });
        }
      })
      .catch(function (erro) {
        console.log("Erro na requisição:", erro);
      });
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  