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

// Variáveis para gerenciamento de salas e histórico
const salas = {};
const historicoDesenhos = {};
const usuarios = {}; // Rastreia a última sala de cada usuário
let contadorSalas = 1;

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

// WebSocket - Lógica do servidor Socket.IO
io.on("connection", (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // Evento para entrar em uma sala específica ou aleatória
    socket.on("entrarNaSala", (sala) => {
        const salaAnterior = usuarios[socket.id] || sala;

        if (salaAnterior && salas[salaAnterior]) {
            adicionarUsuarioNaSala(socket, salaAnterior);
            delete usuarios[socket.id];
        } else if (sala) {
            if (salas[sala]) {
                adicionarUsuarioNaSala(socket, sala);
            } else {
                socket.emit("erroSala", "Sala não encontrada.");
            }
        } else {
            const salaDisponivel = buscarSalaComVaga() || criarNovaSala();
            adicionarUsuarioNaSala(socket, salaDisponivel);
        }
    });

    // Evento para listar todas as salas disponíveis
    socket.on("listarSalas", () => {
        const salasDisponiveis = Object.keys(salas).map((sala) => ({
            nome: sala,
            usuarios: salas[sala].usuarios.length,
        }));
        socket.emit("salasDisponiveis", salasDisponiveis);
    });

    // Evento para desenhar no canvas
    socket.on("desenhar", (data, sala) => {
        if (salas[sala]?.desenhadorAtual === socket.id) {
            historicoDesenhos[sala].push(data);
            socket.to(sala).emit("desenharNoCanvas", data);
        }
    });

    // Evento para limpar o canvas
    socket.on("limparCanvas", (sala) => {
        if (salas[sala]?.desenhadorAtual === socket.id) {
            historicoDesenhos[sala] = [];
            io.to(sala).emit("limparCanvas");
        }
    });

    // Evento para alternar o desenhador
    socket.on("trocarDesenhador", (sala) => {
        if (salas[sala]?.usuarios.includes(socket.id)) {
            salas[sala].desenhadorAtual =
                salas[sala].desenhadorAtual === socket.id ? null : socket.id;
            io.to(sala).emit("permissaoDesenho", salas[sala].desenhadorAtual);
        }
    });

    // Desconexão do usuário
    socket.on("disconnect", () => {
        console.log(`Usuário desconectado: ${socket.id}`);
        for (let sala in salas) {
            if (salas[sala].usuarios.includes(socket.id)) {
                salas[sala].usuarios = salas[sala].usuarios.filter((id) => id !== socket.id);

                // Salva a última sala do usuário
                usuarios[socket.id] = sala;

                if (salas[sala].desenhadorAtual === socket.id) {
                    salas[sala].desenhadorAtual = null;
                    io.to(sala).emit("permissaoDesenho", null);
                }

                if (salas[sala].usuarios.length === 0) {
                    delete salas[sala];
                    delete historicoDesenhos[sala];
                }
            }
        }
    });
});

// Funções auxiliares
function adicionarUsuarioNaSala(socket, sala) {
    if (!salas[sala]) {
        salas[sala] = { usuarios: [], desenhadorAtual: null };
        historicoDesenhos[sala] = [];
    }

    salas[sala].usuarios.push(socket.id);
    socket.join(sala);

    // Envia histórico e confirma entrada
    socket.emit("atualizarCanvas", historicoDesenhos[sala]);
    socket.emit("salaConfirmada", sala);

    // Define desenhador inicial, se necessário
    if (!salas[sala].desenhadorAtual) {
        salas[sala].desenhadorAtual = socket.id;
        io.to(sala).emit("permissaoDesenho", socket.id);
    }

    io.to(sala).emit("atualizarSala", salas[sala].usuarios);
}

function buscarSalaComVaga() {
    for (let sala in salas) {
        if (salas[sala].usuarios.length < 10) return sala;
    }
    return null;
}

function criarNovaSala() {
    const novaSala = `sala${contadorSalas++}`;
    salas[novaSala] = { usuarios: [], desenhadorAtual: null };
    historicoDesenhos[novaSala] = [];
    console.log(`Nova sala criada: ${novaSala}`);
    return novaSala;
}

// Inicialização do servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
