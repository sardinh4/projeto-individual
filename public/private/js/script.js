let roomsInterval = null;

window.onload = () => {
  hideAllSections(sections);
  document.getElementById("home_section").style.display = "grid";

  bootButtons();
};

function bootButtons() {
  document.getElementById("username").innerText = `${sessionStorage.username}`;

  // HOME
  document.getElementById("home_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "home_section", "30px");
  });

  // NEW ROON
  document.querySelectorAll(".btn_new_roon").forEach((button) => {
    button.addEventListener("click", () => {
      configureScreenExibition(sections, "play_section", 0);
    });
  });

  // PLAY/LIST ROON
  document.querySelectorAll("#play_btn, #btn_list_rooms").forEach((button) => {
    button.addEventListener("click", () => {
      configureScreenExibition(sections, "rooms_section", "30px");
    });
  });

  // DRAW
  document.getElementById("draw_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "draw_section", "30px");
  });

  // MY GALERY
  document.getElementById("my_galery_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "my_galery_section", 0);
  });

  // MY PROGREES
  document.getElementById("my_progrees_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "my_progress_section", 0);
  });

  // CONFIGURATION
  document.getElementById("configuration_btn").addEventListener("click", () => {
    configureScreenExibition(sections, "configuration_section", 0);
  });

  // OUT
  document.getElementById("out_btn").addEventListener("click", () => {
    window.location = "../../auth/auth.html";
  });
}

var sections = document.querySelectorAll(".main_section, #transition_section");

function configureScreenExibition(sections, idSection, padding) {
  hideAllSections(sections);
  showSection(idSection, padding);

  if (idSection === "rooms_section" && !roomsInterval) {
    showRooms();
    roomsInterval = setInterval(() => {
      showRooms();
    }, 10000);
  } else if (idSection !== "rooms_section" && roomsInterval) {
    clearInterval(roomsInterval); // Para a atualização se não estiver na seção de salas
    roomsInterval = null;
  }
}

function showSection(idSection, padding) {
  document.getElementById(`${idSection}`).style.display = `grid`;
  document.getElementById("main").style.padding = padding;
}

function hideAllSections(sections) {
  sections.forEach((section) => {
    section.style.display = "none";
  });
}

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

  connectAndJoinRoom(codRoom);

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

let socket;
let roomId = null; // ID da sala
let currentCanvasState = null; // Estado atual do canvas

// Cria a nova sala
document.querySelectorAll(".btn_new_roon").forEach((button) => {
  button.addEventListener("click", () => {
    if (!socket || socket.disconnected) {
      socket = io(); // Conectar ao servidor Socket.IO
    }
    // Criar a sala no servidor
    createRoom();
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

// Função para conectar e entrar na sala
function connectAndJoinRoom(roomId) {
  socket = io(); // Conecta ao servidor Socket.IO

  socket.on("connect", () => {
    console.log("Conectado ao servidor");

    socket.emit("join_room", roomId, (response) => {
      if (response.success) {
        socket.roomId = roomId; // Atribui a sala ao socket
        console.log(`Entrou na sala ${roomId}`);
      } else {
        console.log(response.message);
      }
    });

    // Atualiza o canvas com os dados recebidos
    socket.on("canvas_update", (dataURL) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        ctx.drawImage(img, 0, 0); // Desenha a imagem recebida
      };
    });

    // Recebe o estado inicial do canvas
    socket.on("initial_canvas_state", (dataURL) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        ctx.drawImage(img, 0, 0); // Desenha o estado inicial
      };
    });
  });

  socket.on("not_drawing_permission", (data) => {
    if (data.canDraw === false) {
      canvas.removeEventListener("mousedown", handleMouseDown)
    
    }else{
      canvas.addEventListener("mousedown", handleMouseDown)
    }
  });

  // Escutando o evento de mudança de desenhador
  socket.on("new_drawing_user", (data) => {
    console.log(`Agora, o desenhador é o usuário com ID: ${data.userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Desconectado do servidor!");
  });
}

// Criar a sala
function createRoom() {
  socket.emit("create_room", (response) => {
    if (response.success) {
      roomId = response.roomId;
      console.log(`Sala criada com sucesso: ${roomId}`);
      socket.emit("join_room", roomId, (response) => {
        if (response.success) {
          socket.roomId = roomId; // Atribui a sala ao socket
          console.log(`Entrou na sala ${roomId}`);
        } else {
          console.log(response.message);
        }
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      emitCanvasData(); // Atualiza os dados do canvas

      // Atualiza o canvas com os dados recebidos
      socket.on("canvas_update", (dataURL) => {
        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
          ctx.drawImage(img, 0, 0); // Desenha a imagem recebida
        };
      });

      // Recebe o estado inicial do canvas
      socket.on("initial_canvas_state", (dataURL) => {
        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
          ctx.drawImage(img, 0, 0); // Desenha o estado inicial
        };
      });

      socket.on("not_drawing_permission", (data) => {
        if (data.canDraw === false) {
          canvas.removeEventListener("mousedown", handleMouseDown)
        }else{
          canvas.addEventListener("mousedown", handleMouseDown)
        }
      });

      // Escutando o evento de mudança de desenhador
      socket.on("new_drawing_user", (data) => {
        console.log(`Agora, o desenhador é o usuário com ID: ${data.userId}`);
      });

      socket.on("disconnect", () => {
        console.log("Desconectado do servidor!");
      });
    } else {
      console.log(response.message);
    }
  });
}

function registerRommHistoryBD(codRoom) {
  fetch("/history/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userNameServer: sessionStorage.username,
      codRoomServer: codRoom,
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        console.log("registerRommHistoryBD() realizado com sucesso! .");

        return true;
      } else {
        throw "Houve um erro ao tentar realizar o registerRommHistoryBD()!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });

  return false;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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
window.addEventListener("resize", resizeCanvas);

// Define a cor do pincel
inputColor.addEventListener("change", ({ target }) => {
  ctx.fillStyle = target.value;
  ctx.strokeStyle = target.value;
});

// Eventos para pintar e apagar


canvas.addEventListener("mousedown", handleMouseDown);


function handleMouseDown(event) {
  const { clientX, clientY } = event;
  isPainting = true;
  if (activeTool === "brush") draw(clientX, clientY);
  if (activeTool === "rubber") erase(clientX, clientY);
}


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

const emitCanvasData = () => {
  if (socket && socket.connected && socket.roomId) {
    // Verifica se o socket está conectado
    const dataURL = canvas.toDataURL(); // Captura a imagem do canvas em formato base64
    socket.emit("draw_data", dataURL); // Envia para o servidor
  }
};

// Adiciona eventos aos botões
tools.forEach((tool) => tool.addEventListener("click", selectTool));
sizeButtons.forEach((button) => button.addEventListener("click", selectSize));
