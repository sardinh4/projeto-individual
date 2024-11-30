// SEÇAO DE CADASTRO

// ADICIONA UM EVENTO NO CAMPO "input_confirmacao_senha" PARA ATIVAR O BOTÃO DE CADASTRAR QUANDO A TECLA "ENTER" FOR PRECIONADA

document
  .getElementById("input_confirmacao_senha")
  .addEventListener("keydown", function (event) {
    // Verifica se a tecla pressionada é o "Enter"
    if (event.key === "Enter") {
      // Impede o comportamento padrão do "Enter"
      event.preventDefault();
      // Aciona o clique no botão
      document.getElementById("btn_cadastrar").click();
    }
  });

//

// FUNÇÃO PARA SÓ PERMITIR QUE O FORMULÁRIO DE CADASTRO SEJA ENVIADO SOMENTE SE AS CONDIÇÕES FOREM ATENDIDAS

document
  .getElementById("formulario_cadastro")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // EVITA O ENVIO IMEDIATO DO FORMULÁRIO QUANDO APERTADO O BOTÃO DE SUBMIT

    if (
      input_nome_usuario.value == "" ||
      input_email_cadastro.value == "" ||
      input_senha_cadastro.value == "" ||
      input_confirmacao_senha.value == ""
    ) {
      alert("Por favor, preencha todos os campos.");
    } else {
      let userNameValido, emailValido;

      if (validarUserName("input_nome_usuario")) {
        userNameValido = true;
      } else {
        alert("Seu nome de usuário deve conter pelo menos 6 caracteres");
        userNameValido = false;
      }

      if (validarEmail("input_email_cadastro")) {
        emailValido = true;
      } else {
        alert("E-mail inválido");

        emailValido = false;
      }
      if (!validarSenha(input_senha_cadastro.value)) {
        alert(
          "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial"
        );
      }

      if (
        userNameValido &&
        emailValido &&
        validarSenha(input_senha_cadastro.value)
      ) {
        if (cadastrar()) {
          this.submit(); // Envia o formulário

          // simulação depois do cadastro
          body.className = "login_js";
          habilitarDesabilitarNavegacaoTab(
            "input",
            ".main_container_login",
            "0"
          );
          habilitarDesabilitarNavegacaoTab(
            "button",
            ".main_container_login",
            "0"
          );
          habilitarDesabilitarNavegacaoTab(
            "input",
            ".main_container_cadastro",
            "-1"
          );
          habilitarDesabilitarNavegacaoTab(
            "button",
            ".main_container_cadastro",
            "-1"
          );
        }
      }
    }
  });

//

function cadastrar() {

  // Recupera o valor do input com o ID 'input_nome_usuario'
  const userName = document.getElementById("input_nome_usuario").value;
  // Recupera o valor do input com o ID 'input_email_cadastro'
  const email = document.getElementById("input_email_cadastro").value;
  // Recupera o valor do input com o ID 'input_senha_cadastro'
  const password = document.getElementById("input_senha_cadastro").value;

  // função cadastrar - router - controller - modulo

  fetch("/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userNameServer: userName, // userName do usuário
      emailServer: email, // E-mail do usuário
      passwordServer: password, // Senha do usuário
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        console.log(
          "Cadastro realizado com sucesso! Redirecionando para tela de Login..."
        );
        alert("Cadastrado com sucesso!");
        return true;
      } else {
        throw "Houve um erro ao tentar realizar o cadastro!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
    });

  return false;
}
