var roomsHistoryModel = require("../models/roomsHistoryModel");

function register(req, res) {
  console.log("Entrei no controler" + req.body.userNameServer + req.body.codRoomServer);
  const username = req.body.userNameServer;
  const codRoom = req.body.codRoomServer; // Corrigido o nome da variável


  if (!username) {
    return res.status(400).send("O username está undefined!");
  }
  if (!codRoom) {
    return res.status(400).send("O codRoom está undefined!");
  }

  console.log("passei das validações");

  roomsHistoryModel
    .register(username, codRoom)
    .then((resultado) => {
      res.json({ success: true, resultado });
    })
    .catch((erro) => {
      console.error(
        "Erro ao realizar o cadastro do usuário na nova sala:",
        erro.sqlMessage
      );
      res.status(500).json({ success: false, erro: erro.sqlMessage });
    });
}


module.exports = {
  register,
};
