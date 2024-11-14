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
    
        // if (emailValue == "hfsystem@sptech.school" && senhaValue == "admin123") {
        //   alert("Login realizado com sucesso");
        //   entrar()
        //   window.location.href = "./../private/dashboard.html";
        // } else {
        //   alert("Email ou senha incorretos");
        // }

        entrar()
      });
  }
  
  //

   function entrar() {
     
        var emailVar = document.getElementById("input_email_login").value;
        var senhaVar =  document.getElementById("input_senha_login").value;

        if (emailVar == "" || senhaVar == "") {
          alert("Preencha todos os campo");
            return false;
        }

        console.log("FORM LOGIN: ", emailVar);
        console.log("FORM SENHA: ", senhaVar);

        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: emailVar,
                senhaServer: senhaVar,
                
            })
        }).then(function (resposta) {
            console.log("ESTOU NO THEN DO entrar()!")

            if (resposta.ok) {
                console.log(resposta);

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json));
                    
                    setTimeout(function () {
                        window.location = "../../private/menu.html";
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
    }
