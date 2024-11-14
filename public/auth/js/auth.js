// AO CARREGAR A PÁGINA, RESGATA A CLASSE ARMAZENADA NO LOCALSTORAGE PARA SETAR A CLASSE DO BODY E ATIVA A ANIMAÇÃO E DESABILITA E HABILITA A NAVEÇÃO DO TAB DE SERTOS CAMPOS
// ESSA CLASSE É ENVIADA QUANDO O USUÁRIO CLICA OU EM SE CADASTRAR OU EM LOGIN FORA DO AUTH.HTML

const bodyClass = localStorage.getItem("bodyClass");

localStorage.clear();

if (bodyClass) {
  document.body.classList.add(bodyClass);

  if (bodyClass == "cadastro_js") {
    habilitarDesabilitarNavegacaoTab("input", ".main_container_login", "-1");
    habilitarDesabilitarNavegacaoTab("button", ".main_container_login", "-1");
    habilitarDesabilitarNavegacaoTab("input", ".main_container_cadastro", "0");
    habilitarDesabilitarNavegacaoTab("button", ".main_container_cadastro", "0");
  }

  if (bodyClass == "login_js") {
    habilitarDesabilitarNavegacaoTab("input", ".main_container_login", "0");
    habilitarDesabilitarNavegacaoTab("button", ".main_container_login", "0");
    habilitarDesabilitarNavegacaoTab("input", ".main_container_cadastro", "-1");
    habilitarDesabilitarNavegacaoTab(
      "button",
      ".main_container_cadastro",
      "-1"
    );
  }
}

// FUNÇÕES PARA TROCAR CLASSE DO BODY PARA ATIVAR A ANIMAÇÃO E CONFIGURA A NAVEGAÇÃO POR TAB SEMPRE QUE O BOTÃO CORRESPONDENTE É ACIONADO

const body = document.querySelector("body");
const btnCadastro = document.getElementById("btn_cadastro_toggle");
const btnLogin = document.getElementById("btn_login_toggle");

btnCadastro.addEventListener("click", () => {
  body.className = "cadastro_js";
  habilitarDesabilitarNavegacaoTab("input", ".main_container_login", "-1");
  habilitarDesabilitarNavegacaoTab("button", ".main_container_login", "-1");
  habilitarDesabilitarNavegacaoTab("input", ".main_container_cadastro", "0");
  habilitarDesabilitarNavegacaoTab("button", ".main_container_cadastro", "0");
});

btnLogin.addEventListener("click", () => {
  body.className = "login_js";
  habilitarDesabilitarNavegacaoTab("input", ".main_container_login", "0");
  habilitarDesabilitarNavegacaoTab("button", ".main_container_login", "0");
  habilitarDesabilitarNavegacaoTab("input", ".main_container_cadastro", "-1");
  habilitarDesabilitarNavegacaoTab("button", ".main_container_cadastro", "-1");
});

//