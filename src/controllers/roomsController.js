var roomsModel = require("../models/roomsModel");

function listrooms(req, res) {
  roomsModel
    .listrooms()
    .then(function (resultado) {
      console.log(`\nResultados encontrados: ${resultado.length}`);
      console.log(`Resultados: ${JSON.stringify(resultado)}`); // transforma JSON em String

      if (resultado.length >= 1) {
        console.log(resultado);

        res.json({
          rooms: resultado,
        });
      } else if (resultado.length == 0) {
        res.json({
          rooms: 0,
        });
        res.status(403).send("Nenhuma sala ativa!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log(
        "\nHouve um erro ao tentar o listar as salas! Erro: ",
        erro.sqlMessage
      );
      res.status(500).json(erro.sqlMessage);
    });
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
