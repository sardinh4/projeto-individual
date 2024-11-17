//FUNÇÃO PARA HABILITAR E DESABILITAR A NEVEGAÇÃO POR TAB DE CERTOS CAMPOS

function habilitarDesabilitarNavegacaoTab(campoType, local, tabIndex) {
  {
    const campos = document.querySelectorAll(`${local} ${campoType}`);

    campos.forEach(function (campo) {
      if (
        campo.tagName === "I" ||
        campo.tagName === "LABEL" ||
        campo.tagName === "BUTTON" ||
        campo.tagName === "INPUT" ||
        campo.tagName === "TEXTAREA" ||
        campo.tagName === "SELECT" ||
        campo.tagName === "A"
      ) {
        campo.setAttribute("tabindex", tabIndex);
        if (campo.tagName === "I") {
          campo.removeAttribute("aria-hidden");

          // ADICIONA UM RÓTULO DE ACESSIBILIDADE
          campo.setAttribute("aria-label", "Ícone interativo");

          // ADICIONA UM PAPEL SEMÂNTICO
          campo.setAttribute("role", "button");
        }
      }
    });
  }
}
