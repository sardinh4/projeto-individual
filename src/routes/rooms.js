var express = require("express");
var router = express.Router();

var roomsController = require("../controllers/roomsController");

//Recebendo os dados do html e direcionando para a função cadastrar de roomsController.js

router.get("/listrooms", function (req, res) {
    roomsController.listrooms(req, res);
});


router.post("/createRoom", function (req, res) {
    roomsController.createRoom(req, res);
})

module.exports = router;