var reservatorioModel = require("../models/reservatorioModel")

function buscarReservatoriosPorFazenda(req, res) {
    var idEmpresa = req.params.idEmpresa

    reservatorioModel.buscarReservatoriosPorFazenda(idEmpresa).then((resultado) => {
        if (resultado.lenth > 0) {
            res.status(200).json(resultado)
        } else {
            res.status(204).json([])
        }
    }).catch(function (erro){
        console.log(erro)
        console.log("Houve um erro ao buscar os reservatórios: ", erro.sqlMessage)
        res.status(500).json(erro.sqlMessage)
    })
}

function cadastrar(req, res) {
    var nome = req.body.nome
    var idFazenda = req.body.idFazenda

    if (nome == undefined) {
        res.status(400).send("descricao está undefined!")
    } else if (idFazenda == undefined) {
        res.status(400).send("idFazenda está undefined!")
    } else {

        reservatorioModel.cadastrar(nome, idFazenda)
            .then((resultado) => {
                res.status(201).json(resultado)
            }
            ).catch((erro) => {
                console.log(erro)
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                )
                res.status(500).json(err.sqlMessage)
            });
    }
}

module.exports = {
    buscarReservatoriosPorFazenda,
    cadastrar
}