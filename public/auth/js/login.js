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
                    sessionStorage.username = json.username;
                    
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
  

