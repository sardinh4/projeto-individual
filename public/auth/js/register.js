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

    let campoMensagemErro = document.getElementById("campo_mensagem_erro");
    campoMensagemErro.innerHTML = "";
    let mensagemErro = "";

    const formulario = document.getElementById("formulario_cadastro");

    if (
      input_nome_usuario.value == "" ||
      input_email_cadastro.value == "" ||
      input_razao_social.value == "" ||
      input_nome_fantasia.value == "" ||
      input_cnpj.value == "" ||
      input_representante_legal.value == "" ||
      input_senha_cadastro.value == "" ||
      input_confirmacao_senha.value == ""
    ) {
      alert("Por favor, preencha todos os campos.");
    } else {
      let userNameValido, emailValido;

      if (validarUserName("input_nome_usuario")) {
        userNameValido = true;
      } else {
        mensagemErro += `<p>* seu nome de usuário deve conter pelo menos 6 caracteres</p>`;
        userNameValido = false;
      }

      if (validarEmail("input_email_cadastro")) {
        emailValido = true;
      } else {
        mensagemErro += "<p>* e-mail inválido</p>";
        emailValido = false;
      }
      if (!validarSenha(input_senha_cadastro.value)) {
        mensagemErro +=
          "<p>* A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial</p>";
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
      } else {
        campoMensagemErro.innerHTML = mensagemErro;
        campoMensagemErro.style.display = "block";
        formulario.style.gridTemplateRows = "repeat(6, auto)";
        formulario.style.gridTemplateAreas = `
            "div_input_usuario div_input_email"
            "div_input_razao_social div_input_nome_fantasia"
            "div_input_cnpj div_input_representante_legal"
            "div_input_senha div_input_confirmacao_senha"
            "campo_mensagem_erro campo_mensagem_erro"
            "btn btn"`;
      }
    }
  });

//

function cadastrar() {
  // aguardar();

  // Recupera o valor do input com o ID 'input_nome_usuario'
  const nomeUsuario = document.getElementById("input_nome_usuario").value;
  // Recupera o valor do input com o ID 'input_email_cadastro'
  const email = document.getElementById("input_email_cadastro").value;
  // Recupera o valor do input com o ID 'input_razao_social'
  const razaoSocial = document.getElementById("input_razao_social").value;
  // Recupera o valor do input com o ID 'input_nome_fantasia'
  const nomeFantasia = document.getElementById("input_nome_fantasia").value;
  // Recupera o valor do input com o ID 'input_cnpj' e  Remove todos os caracteres que não são dígitos (números) do valor do campo.
  const cnpj = document.getElementById("input_cnpj").value.replace(/\D/g, "");
  // Recupera o valor do input com o ID 'input_representante_legal'
  const representanteLegal = document.getElementById(
    "input_representante_legal"
  ).value;
  // Recupera o valor do input com o ID 'input_senha_cadastro'
  const senha = document.getElementById("input_senha_cadastro").value;

  // função cadastrar - router - controller - modulo 

  fetch("/empresas/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeUsuarioServer: nomeUsuario, // Nome do usuário
      emailServer: email, // E-mail do usuário
      razaoSocialServer: razaoSocial, // Razão social
      nomeFantasiaServer: nomeFantasia, // Nome fantasia
      cnpjServer: cnpj, // CNPJ
      representanteLegalServer: representanteLegal, // Representante legal
      senhaServer: senha, // Senha do usuário
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
