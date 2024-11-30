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


// Configurar o Socket.IO
io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    // Reenviar dados do canvas para todos os clientes
    socket.on('draw_data', (data) => {
      socket.broadcast.emit('draw_data', data);
  });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});


// Inicialização do servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});





