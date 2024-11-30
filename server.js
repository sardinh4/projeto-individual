// Ambiente e Configuração 
var ambiente_processo = "desenvolvimento"; // Pode ser 'producao' ou 'desenvolvimento'
var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev'; // Definindo o arquivo .env a ser usado
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
var roonsRouter = require("./src/routes/roons");

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/roons", roonsRouter);

// Definindo as variáveis para gerenciamento de salas
let rooms = {}; // Armazena as salas e seus respectivos usuários
let roomCount = 1; // Contador de salas
let currentCanvasState = null; // Variável para armazenar o estado atual do canvas

// Configurar o Socket.IO
io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    // Atribui o usuário a uma sala
    let roomId = `room_${roomCount}`;
    
    // Se a sala não existe, cria uma nova
    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    // Adiciona o cliente à sala
    rooms[roomId].push(socket.id);
    socket.join(roomId);
    console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);

    // Quando a sala atingir 10 usuários, cria uma nova sala
    if (rooms[roomId].length === 10) {
        roomCount++; // Cria nova sala
        console.log(`Sala ${roomId} cheia. Criando nova sala: room_${roomCount}`);
    }

    // Envia o id da sala para o cliente
    socket.emit('joined_room', roomId);

    // Envia o estado atual do canvas (se houver) para o novo cliente
    if (currentCanvasState) {
        socket.emit('initial_canvas_state', currentCanvasState);
    }

    // Reenvia dados do canvas para todos os clientes na sala, exceto para o remetente
    socket.on('draw_data', (data) => {
        currentCanvasState = data; // Atualiza o estado do canvas
        socket.broadcast.to(roomId).emit('draw_data', data);
    });

    // Quando o cliente desconectar, remove-o da sala
    socket.on('disconnect', () => {
        rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
        console.log(`Usuário ${socket.id} saiu da sala ${roomId}`);
        if (rooms[roomId].length === 0) {
            delete rooms[roomId]; // Deleta sala vazia
        }
    });
});

// Inicialização do servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
