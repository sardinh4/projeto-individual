var express = require("express");
var router = express.Router();

var roonsController = require("../controllers/roonsController");

//Recebendo os dados do html e direcionando para a função cadastrar de roonsController.js

router.get("/listRoons", function (req, res) {
    roonsController.listRoons(req, res);
});

module.exports = router;