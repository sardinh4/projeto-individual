var database = require("../database/config");

function listrooms() {
  console.log(
    "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listrooms() "
  );
  var sqlINstruction = `
        SELECT * FROM room WHERE status = 'active';
    `;
  console.log("Executando a instrução SQL: \n" + sqlINstruction);
  return database.executar(sqlINstruction);
}

function createRoom() {
  console.log(
    "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function createRoom():"
  );

  var sqlINstruction = `insert into room (idRoom) value (default);`;

  console.log("Executando a instrução SQL 1:\n" + sqlINstruction);

  database.executar(sqlINstruction);

  sqlINstruction = "SELECT * FROM room ORDER BY idRoom DESC LIMIT 1;";
  console.log("Executando a instrução SQL 2:\n" + sqlINstruction);

  return database.executar(sqlINstruction);
}

module.exports = {
  listrooms,
  createRoom,
};
