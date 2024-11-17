var mysql = require("mysql2"); // Importa o módulo `mysql2`, que permite a conexão e execução de consultas no MySQL.
 
// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = { // Configurações da conexão com o banco de dados
    host: process.env.DB_HOST, // Endereço do servidor de banco de dados (definido em uma variável de ambiente).
    database: process.env.DB_DATABASE, // Nome do banco de dados.
    user: process.env.DB_USER, // Nome de usuário para acessar o banco.
    password: process.env.DB_PASSWORD, // Senha do usuário.
    port: process.env.DB_PORT // Porta do servidor MySQL.
};

function executar(instrucao) { // Define uma função para executar consultas SQL no banco.

    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        // Verifica se o ambiente está definido como "produção" ou "desenvolvimento". 
        // Se não estiver, exibe uma mensagem de erro e rejeita a execução com uma promessa.
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    // Retorna uma promessa para lidar com a execução da consulta de forma assíncrona.
    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig); // Cria uma nova conexão MySQL com as configurações definidas.
        conexao.connect(); // Conecta ao banco de dados.

        // Executa a consulta SQL passada como argumento `instrucao`.
        conexao.query(instrucao, function (erro, resultados) {
            conexao.end(); // Fecha a conexão após a execução da consulta para liberar recursos.
            if (erro) {
                reject(erro); // Em caso de erro, rejeita a promessa com o erro.
            }
            console.log(resultados); // Exibe os resultados no console.
            resolve(resultados); // Resolve a promessa com os resultados da consulta.
        });

        // Define um event listener para erros de conexão.
        conexao.on('error', function (erro) {
            return ("ERRO NO MySQL SERVER: ", erro.sqlMessage); // Exibe uma mensagem de erro no console.
        });
    });
}

module.exports = {
    executar // Exporta a função `executar`, permitindo que outros módulos usem essa função para executar consultas no banco.
};
