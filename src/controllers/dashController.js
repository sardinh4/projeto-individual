var dashModel = require("../models/dashModel.js");

function showHistory(req, res) {
  console.log("Entrei no controlador");
  const username = req.body.userNameServer;

  // Verifica se o username foi enviado
  if (!username) {
    return res.status(400).send("O username está undefined!");
  }

  console.log("passei das validações");

  // Chama a função showHistory do modelo
  dashModel
    .showHistory(username)
    .then((resultado) => {
      console.log("Resultado:", resultado); // Exibe o resultado no console para debug

      // Verifica se o resultado contém os dados esperados
      if (resultado) {
        return res.json({
          success: true,
          resultado: resultado
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Nenhum dado encontrado para o usuário."
        });
      }
    })
    .catch((erro) => {
      console.error("Erro ao consultar o histórico do usuário:", erro);
      res.status(500).json({
        success: false,
        erro: erro.message || erro.sqlMessage
      });
    });
}

module.exports = {
  showHistory,
};
