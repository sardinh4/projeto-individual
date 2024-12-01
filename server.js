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
  // Configurações da conexão com o banco de dados
  host: "localhost", // Endereço do servidor de banco de dados (definido em uma variável de ambiente).
  database: "sketchup", // Nome do banco de dados.
  user: "root", // Nome de usuário para acessar o banco.
  password: "L04s28S03", // Senha do usuário.
  port: "3306", // Porta do servidor MySQL.
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
let roomsCanvasState = {}; // Armazena o estado do canvas para cada sala

// Função para gerar um ID de 8 caracteres
function gerarIdUnico() {
  const id = uuidv4(); // Gera o UUID padrão
  return id.split("-")[0].slice(0, 8); // Extrai a primeira parte do UUID e pega os 8 primeiros caracteres
}

// SOCKET.IO
io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  // Emite as salas disponíveis para o cliente assim que ele se conectar
  socket.emit("availableRooms", Object.keys(activeRooms));

  // Criar uma nova sala
  socket.on("create_room", async (callback) => {
    // Gerar um ID único para a sala de 8 caracteres
    const roomId = gerarIdUnico();
    console.log(`Criando sala com ID: ${roomId}`);

    // Verificar se a sala já existe
    if (activeRooms[roomId]) {
      console.log(`Sala ${roomId} já existe.`);
      return callback({ success: false, message: "Sala já existe." });
    }

    // Criar a sala no Socket.IO
    activeRooms[roomId] = { users: new Set([socket.id]) };

    // Entrar na sala
    socket.join(roomId);
    console.log(`Nova sala criada: ${roomId} pelo usuário ${socket.id}`);

    // Salvar a sala no banco de dados
    try {
      const query = `INSERT INTO room (codRoom) VALUES ('${roomId}')`;
      await executar(query); // Executa a query de inserção no banco de dados

      // Retorna sucesso
      callback({ success: true, roomId });
    } catch (erro) {
      console.log("Erro ao salvar a sala no banco de dados:", erro);
      callback({
        success: false,
        message: "Erro ao salvar a sala no banco de dados.",
      });
    }
  });

  // Entrar em uma sala existente
  socket.on("join_room", (roomId, callback) => {
    if (!activeRooms[roomId]) {
      console.log(`Sala ${roomId} não encontrada.`);
      return callback({ success: false, message: "Sala não encontrada." });
    }

    // Entrar na sala
    socket.join(roomId);
    activeRooms[roomId].users.add(socket.id); // Adicionar o usuário à sala

    console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);

    // Envia o estado atual do canvas daquela sala (se houver)
    if (roomsCanvasState[roomId]) {
      console.log("Estado do canvas encontrado:", roomsCanvasState[roomId]);
      socket.emit("initial_canvas_state", roomsCanvasState[roomId]);
    }

    callback({ success: true, roomId });
  });

  // Reenvia dados do canvas para todos os clientes na sala, exceto para o remetente
  socket.on("draw_data", (roomId, data) => {
    if (!activeRooms[roomId]) {
      console.log(
        `Tentativa de atualizar canvas de uma sala inexistente: ${roomId}`
      );
      return;
    }

    console.log(`Atualizando canvas para a sala ${roomId}`);
    roomsCanvasState[roomId] = data; // Atualiza o estado do canvas da sala

    // Envia os dados atualizados para todos os outros clientes na sala
    socket.to(roomId).emit("draw_data", data);
  });

  // Quando o usuário entra em uma sala, envia o estado inicial do canvas
  socket.on("join_room", (roomId, callback) => {
    if (!activeRooms[roomId]) {
      console.log(`Sala ${roomId} não encontrada.`);
      return callback({ success: false, message: "Sala não encontrada." });
    }

    // Entrar na sala
    socket.join(roomId);
    activeRooms[roomId].users.add(socket.id); // Adicionar o usuário à sala

    console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);

    // Envia o estado atual do canvas daquela sala (se houver)
    if (roomsCanvasState[roomId]) {
      console.log(
        "Enviando estado inicial do canvas:",
        roomsCanvasState[roomId]
      );
      socket.emit("initial_canvas_state", roomsCanvasState[roomId]);
    }

    callback({ success: true, roomId });
  });

  // Gerenciar desconexão
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);

    // Remover o cliente da(s) sala(s) em que ele estava
    Object.keys(activeRooms).forEach((roomId) => {
      const room = activeRooms[roomId];
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id); // Remove o cliente da sala
        if (room.users.size === 0) {
          console.log(`Sala ${roomId} está vazia, mas permanece ativa.`);
        }
      }
    });
  });
});

// Inicialização do servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
