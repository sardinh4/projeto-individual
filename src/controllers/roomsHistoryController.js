var roomsHistoryModel = require("../models/roomsHistoryModel");

function register(req, res) {
  // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
  var roomCod = req.body.roomCodServer;

  // Faça as validações dos valores
  if (roomCod == undefined) {
    res.status(400).send("O roomCod está undefined!");
  } else {
    // Passe os valores como parâmetro e vá para o arquivo roomsHistoryModel.js
    roomsHistoryModel
      .register(roomCod)
      .then(function (resultado) {
        res.json(resultado);
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
}

module.exports = {
  register,
};
