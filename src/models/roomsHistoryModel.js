var database = require("../database/config");

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function register(username, codRoom) {
  const instrucaoSql = `
    INSERT INTO userHistory (fkRoom, fkUser)
    SELECT r.idRoom, u.idUser
    FROM room r
    JOIN user u
    ON r.codRoom = '${codRoom}' AND u.username = ${username};
  `;

  console.log("Executando a instrução SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  register,
};

