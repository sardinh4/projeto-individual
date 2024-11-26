// SEÇÃO DE LOGIN

// ADICIONA UM EVENTO NO CAMPO "input_senha_login" PARA ATIVAR O BOTÃO DE ENTRAR/LOGIN A TECLA "ENTER" FOR PRECIONADA

document.getElementById("input_senha_login").addEventListener("keydown", function (event) {
    // Verifica se a tecla pressionada é o "Enter"
    if (event.key === "Enter") {
      // Impede o comportamento padrão do "Enter"
      event.preventDefault();
      // Aciona o clique no botão
      document.getElementById("btn_entrar").click();
    }
  });

// FUNÇÃO PARA SÓ PERMITIR ACESSO AO DASHBOARD SE SENHA E E-MAIL FOREM VÁLIDOS

function login() {
    document.getElementById("formulario_login").addEventListener("submit", function (event) {
        event.preventDefault();

        var email = document.getElementById("input_email_login").value;
        var password =  document.getElementById("input_senha_login").value;

        if (email == "" || password == "") {
          alert("Preencha todos os campo");
            return false;
        }

        console.log("FORM LOGIN: ", email);
        console.log("FORM SENHA: ", password);

        fetch("/user/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: email,
                passwordServer: password,
                
            })
        }).then(function (resposta) {
            console.log("ESTOU NO THEN DO entrar()!")

            if (resposta.ok) {
                console.log(resposta);

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json));
                    
                    setTimeout(function () {
                        window.location = "../../private/index.html";
                    }, 1000); // apenas para exibir o loading

                });

            } else {

                console.log("Houve um erro ao tentar realizar o login!");

                resposta.text().then(texto => {
                    console.error(texto);
                    
                });
            }

        }).catch(function (erro) {
            console.log(erro);
        })

        return false;
      });
  }
  



    const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Exemplo de endpoint de login
sketch.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    // Valide o usuário no banco de dados (exemplo básico)
    const usuario = await buscarUsuarioNoBanco(email);
    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    // Verifique a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    // Gere o token
    const token = jwt.sign(
        { id: usuario.id, email: usuario.email }, // Payload
        process.env.JWT_SECRET,                  // Chave secreta
        { expiresIn: "2h" }                      // Tempo de expiração
    );

    res.json({ token });
});
