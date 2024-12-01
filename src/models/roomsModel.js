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

async function createRoom() {
  console.log(
    "ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function createRoom():"
  );

  // Inserção de nova sala
  var sqlINstruction = `insert into room (status) values ('active');`; // Corrigi para garantir que o campo status seja preenchido
  console.log("Executando a instrução SQL 1:\n" + sqlINstruction);
  await database.executar(sqlINstruction); // Aguardando a inserção ser concluída

  // Consultando a última sala criada
  sqlINstruction = "SELECT * FROM room ORDER BY idRoom DESC LIMIT 1;";
  console.log("Executando a instrução SQL 2:\n" + sqlINstruction);
  const result = await database.executar(sqlINstruction); // Aguardando o resultado da consulta

  if (result && result.length > 0) {
    console.log("Sala criada com id:", result[0].idRoom);
    return result[0]; // Retorna o objeto da sala criada
  } else {
    console.log("Erro ao criar a sala.");
    return null; // Caso haja algum erro
  }
}


module.exports = {
  listrooms,
  createRoom,
};
