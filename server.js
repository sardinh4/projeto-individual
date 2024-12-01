require("dotenv").config({ path: ".env.dev" }); // ou '.env.dev' dependendo do ambiente

// Importações
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2"); // Importando o módulo MySQL

// Configuração do servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3333;
const HOST = process.env.HOST || "localhost";

// Configuração do MySQL
var mySqlConfig = {
  host: "localhost",
  database: "sketchup",
  user: "root",
  password: "L04s28S03",
  port: "3306",
};

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

// Banco de dados (Criação de conexão)
function executar(instrucao) {
  return new Promise(function (resolve, reject) {
    const conexao = mysql.createConnection(mySqlConfig);
    conexao.connect();

    conexao.query(instrucao, function (erro, resultados) {
      conexao.end();
      if (erro) {
        reject(erro);
      }
      resolve(resultados);
    });
  });
}

let activeRooms = {}; // Armazena os IDs das salas ativas
let globalCanvasState = {}; // Armazena o estado do canvas por sala

// Função para gerar um ID de 8 caracteres
function gerarIdUnico() {
  const id = uuidv4();
  return id.split("-")[0].slice(0, 8); // Extrai a primeira parte do UUID e pega os 8 primeiros caracteres
}

// SOCKET.IO
io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  // Emite as salas disponíveis para o cliente assim que ele se conectar
  socket.emit("availableRooms", Object.keys(activeRooms));

  // Criar uma nova sala
  socket.on("create_room", async (callback) => {
    const roomId = gerarIdUnico();
    console.log(`Criando sala com ID: ${roomId}`);

    if (activeRooms[roomId]) {
      console.log(`Sala ${roomId} já existe.`);
      return callback({ success: false, message: "Sala já existe." });
    }

    activeRooms[roomId] = { users: new Set([socket.id]) };

    socket.join(roomId);
    console.log(`Nova sala criada: ${roomId} pelo usuário ${socket.id}`);

    try {
      const query = `INSERT INTO room (codRoom) VALUES ('${roomId}')`;
      await executar(query);

      // Emitir para todos os clientes na sala (inclusive para o criador)
      io.to(roomId).emit("room_created", {
        roomId,
        users: activeRooms[roomId].users,
      });

      callback({ success: true, roomId });
    } catch (erro) {
      console.log("Erro ao salvar a sala no banco de dados:", erro);
      callback({
        success: false,
        message: "Erro ao salvar a sala no banco de dados.",
      });
    }
  });

  // Recebe os dados do canvas dos clientes e os emite para todos os usuários na sala
  socket.on("draw_data", (dataURL) => {
    if (globalCanvasState[socket.roomId] !== dataURL) {
      globalCanvasState[socket.roomId] = dataURL; // Atualiza o estado da sala específica
      io.to(socket.roomId).emit("canvas_update", dataURL); // Emite para todos os clientes na sala
    }
  });

  // Quando o usuário entra na sala, envia o estado atual do canvas global
  socket.on("join_room", (roomId, callback) => {
    if (!activeRooms[roomId]) {
      console.log(`Sala ${roomId} não encontrada.`);
      return callback({ success: false, message: "Sala não encontrada." });
    }

    socket.join(roomId);
    socket.roomId = roomId; // Atribui o ID da sala ao socket
    activeRooms[roomId].users.add(socket.id);

    // Enviar o estado do canvas para o novo usuário, se houver um estado
    if (globalCanvasState[roomId]) {
      socket.emit("initial_canvas_state", globalCanvasState[roomId]);
    }

    callback({ success: true, roomId });
  });

  // Gerenciar desconexão
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);

    Object.keys(activeRooms).forEach((roomId) => {
      const room = activeRooms[roomId];
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        if (room.users.size === 0) {
          console.log(`Sala ${roomId} está vazia, mas permanece ativa.`);
        }

        // Notificar todos os usuários restantes na sala sobre a desconexão
        io.to(roomId).emit("user_left", {
          userId: socket.id,
          users: room.users,
        });
      }
    });
  });
});

// Inicialização do servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
