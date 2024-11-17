var userModel = require("../models/userModel");


function register(req, res) {

  // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
  var email = req.body.emailServer;
  var password = req.body.passwordServer;
  var name = req.body.nameServer;
  var userName = req.body.userNameServer;

  // Faça as validações dos valores
  if (name == undefined) {
      res.status(400).send("Seu nome está undefined!");
  } else if (email == undefined) {
      res.status(400).send("Seu email está undefined!");
  } else if (userName == undefined) {
      res.status(400).send("Sua nome de usuário está undefined!");
  }else if (password == undefined) {
      res.status(400).send("Sua senha está undefined!");
  } else {

      // Passe os valores como parâmetro e vá para o arquivo userModel.js
      userModel.register(name, userName, email, password)
          .then(
              function (resultado) {
                  res.json(resultado);
              }
          ).catch(
              function (erro) {
                  console.log(erro);
                  console.log(
                      "\nHouve um erro ao realizar o cadastro! Erro: ",
                      erro.sqlMessage
                  );
                  res.status(500).json(erro.sqlMessage);
              }
          );
  }
}



function authenticate(req, res) {
    var email = req.body.emailServer;
    var password = req.body.passwordServer;

    if (email == undefined) {
        res.status(400).send("E-mail está undefined!");
    } else if (password == undefined) {
        res.status(400).send("Senha está indefinida!");
    } else {

        userModel.authenticate(email, password)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);   
                      
                        res.json({
                            email: resultadoAutenticar[0].email,
                            password: resultadoAutenticar[0].password,
                           
                        });                   
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

module.exports = {
    authenticate,
  register
}