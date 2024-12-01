var roomsModel = require("../models/roomsModel");

async function listrooms(req, res) {
  try {
    const resultado = await roomsModel.listrooms();
    console.log(`Resultados encontrados: ${resultado.length}`);
    res.json({ rooms: resultado });
  } catch (erro) {
    console.log(erro);
    res.status(500).json({ message: "Erro ao listar as salas", error: erro });
  }
}

function createRoom(req, res) {
  // Crie uma variável que vá recuperar os valores do arquivo cadastro.html

  // Passe os valores como parâmetro e vá para o arquivo roomsModel.js
  roomsModel
    .createRoom()
    .then(function (resultado) {
      res.json({
        idRoom: resultado[0].idRoom,
      });
    })
    .catch(function (erro) {
      console.log(erro);
      console.log(
        "\nHouve um erro ao realizar o cadastro do usuário na nova sala! Erro: ",
        erro.sqlMessage
      );
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  listrooms,
  createRoom,
};
