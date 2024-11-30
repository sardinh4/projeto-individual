// Ambiente e Configuração
var ambiente_processo = "desenvolvimento"; // Pode ser 'producao' ou 'desenvolvimento'
var caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev"; // Definindo o arquivo .env a ser usado
require("dotenv").config({ path: caminho_env }); // Carrega as variáveis de ambiente do arquivo .env

// Importação de módulos
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

// Configuração do servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || "localhost";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/config", express.static(path.join(__dirname, "config")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use(cors());

// Roteamento
var indexRouter = require("./src/routes/index");
var userRouter = require("./src/routes/user");
var roomsRouter = require("./src/routes/rooms");
var roomsHistoryRouter = require("./src/routes/roomsHistory");

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/rooms", roomsRouter);
app.use("/roomsHistory", roomsHistoryRouter);

// SOCKET.IO

let roomsCanvasState = {}; // Armazena o estado do canvas para cada sala

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  // Criar uma nova sala
  socket.on("create_room", (roomId, callback) => {
    const rooms = io.sockets.adapter.rooms;

    if (rooms.has(roomId)) {
      return callback({ success: false, message: "Sala já existe." });
    }

    socket.join(roomId);
    console.log(`Nova sala criada: ${roomId} pelo usuário ${socket.id}`);
    callback({ success: true, roomId });
  });

  // Entrar em uma sala existente
  socket.on("join_room", (roomId, callback) => {
    const rooms = io.sockets.adapter.rooms;

    if (!rooms.has(roomId)) {
      return callback({ success: false, message: "Sala não encontrada." });
    }

    socket.join(roomId);
    console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);

    // Envia o estado atual do canvas daquela sala (se houver)
    if (roomsCanvasState[roomId]) {
      socket.emit("initial_canvas_state", roomsCanvasState[roomId]);
    }

    callback({ success: true, roomId });
  });

  // Reenvia dados do canvas para todos os clientes na sala, exceto para o remetente
  socket.on("draw_data", (roomId, data) => {
    // Atualiza o estado do canvas daquela sala
    roomsCanvasState[roomId] = data; 

    // Envia os dados para todos os clientes na sala
    socket.to(roomId).emit("draw_data", data);
  });

  // Gerenciar desconexão
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Inicialização do servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});