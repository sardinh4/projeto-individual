var roonsModel = require("../models/roonsModel");

function listRoons(req, res) {
  roonsModel
    .listRoons()
    .then(function (resultado) {
      console.log(`\nResultados encontrados: ${resultado.length}`);
      console.log(`Resultados: ${JSON.stringify(resultado)}`); // transforma JSON em String

      if (resultado.length >= 1) {
        console.log(resultado);

        res.json({
          roons: resultado,
        });
      } else if (resultado.length == 0) {
        res.json({
          roons: 0,
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

module.exports = {
  listRoons,
};
