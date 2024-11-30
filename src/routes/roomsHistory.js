var express = require("express");
var router = express.Router();

var roomsHistoryController = require("../controllers/roomsHistoryController");

//Recebendo os dados do html e direcionando para a função cadastrar de empresaController.js
router.post("/register", function (req, res) {
    roomsHistoryController.register(req, res);
})


module.exports = router;