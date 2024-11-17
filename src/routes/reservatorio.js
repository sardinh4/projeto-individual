var express = require("express")
var router = express.Router()

router.get("/:idFazenda", function (req, res) {
    reservatorioController.buscarReservatoriosPorFazenda(req, res);
})

router.post("/cadastrar", function (req, res) {
    reservatorioController.cadastrar(req, res)
})

module.exports = router 