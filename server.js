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

// Configuração do servidor e porta
const PORTA_APP = process.env.APP_PORT || 3333;
const HOST_APP = process.env.APP_HOST || "localhost";

// Inicialização do servidor Express e Socket.IO
const app = express();
const server = http.createServer(app);  // Correção aqui
const io = new Server(server);  // Correção aqui

// Variáveis globais para gerenciamento das salas e histórico de desenhos
const salas = {};  // Para armazenar informações das salas
const historicoDesenhos = {};  // Para armazenar o histórico de desenhos
let contadorSalas = 1;  // Para incrementar as salas automaticamente

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

app.use("/", indexRouter);
app.use("/user", userRouter);

// Inicialização do WebSocket
io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);

    // Evento para entrar em uma sala
    socket.on('entrarNaSala', (sala) => {
        if (sala) {
            if (!salas[sala]) salas[sala] = { usuarios: [], desenhadorAtual: null };
            if (salas[sala].usuarios.length < 10) {
                adicionarUsuarioNaSala(socket, sala);
            } else {
                socket.emit('erroSala', 'Sala cheia');
            }
        } else {
            const salaDisponivel = buscarSalaComVaga() || criarNovaSala();
            adicionarUsuarioNaSala(socket, salaDisponivel);
        }
    });

    // Evento para trocar o desenhador
    socket.on('trocarDesenhador', (sala) => {
        if (salas[sala] && salas[sala].usuarios.includes(socket.id)) {
            if (salas[sala].desenhadorAtual === socket.id) {
                salas[sala].desenhadorAtual = null;
                io.to(sala).emit('permissaoDesenho', null);
            } else {
                salas[sala].desenhadorAtual = socket.id;
                io.to(sala).emit('permissaoDesenho', socket.id);
            }
        }
    });

    // Evento para desenhar
    socket.on('desenhar', (data, sala) => {
        if (salas[sala] && salas[sala].desenhadorAtual === socket.id) {
            historicoDesenhos[sala].push(data);
            socket.to(sala).emit('desenharNoCanvas', data);
        }
    });

    // Evento de desconexão
    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id);
        for (let sala in salas) {
            if (salas[sala].usuarios.includes(socket.id)) {
                salas[sala].usuarios = salas[sala].usuarios.filter((id) => id !== socket.id);
                if (salas[sala].desenhadorAtual === socket.id) {
                    salas[sala].desenhadorAtual = null;
                    io.to(sala).emit('permissaoDesenho', null);
                }
                if (salas[sala].usuarios.length === 0) {
                    delete salas[sala];
                    delete historicoDesenhos[sala];
                } else {
                    io.to(sala).emit('atualizarSala', salas[sala].usuarios);
                }
            }
        }
    });
});

// Funções auxiliares
function adicionarUsuarioNaSala(socket, sala) {
    if (!salas[sala]) salas[sala] = { usuarios: [], desenhadorAtual: null };
    if (!historicoDesenhos[sala]) historicoDesenhos[sala] = [];

    salas[sala].usuarios.push(socket.id);
    socket.join(sala);
    socket.emit('atualizarCanvas', historicoDesenhos[sala]);

    if (!salas[sala].desenhadorAtual) {
        salas[sala].desenhadorAtual = socket.id;
        io.to(sala).emit('permissaoDesenho', socket.id);
    }

    socket.emit('salaConfirmada', sala);
    io.to(sala).emit('atualizarSala', salas[sala].usuarios);
    console.log(`Usuário ${socket.id} entrou na sala ${sala}.`);
}

function buscarSalaComVaga() {
    for (let sala in salas) {
        if (salas[sala].usuarios.length < 10) {
            return sala;
        }
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

// Inicia o servidor
server.listen(PORTA_APP, () => {
    console.log(`Servidor rodando em http://${HOST_APP}:${PORTA_APP}`);
});
