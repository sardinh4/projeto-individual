// FUNÇÃO DE FORMATAÇÃO DO CAMPO CNPJ
function formatarCNPJ(campo) {
  // Remove todos os caracteres que não são dígitos (números) do valor do campo.
  let cnpj = campo.value.replace(/\D/g, "");
  // Adiciona um ponto após os primeiros dois dígitos do CNPJ.
  cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
  // Adiciona um segundo ponto após os próximos três dígitos.
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  // Adiciona uma barra após os próximos três dígitos.
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
  // Adiciona um hífen após os próximos quatro dígitos.
  cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");

  // Atualiza o valor do campo com o CNPJ formatado.
  campo.value = cnpj;
}

//

// FUNÇÃO PARA OCULTAR E EXIBIR A SENHA

function ocultarExibirSenha(button, campo) {
  const campoSenha = document.getElementById(campo);
  const buttonOcultarExibir = document.getElementById(button);

  if (campoSenha.type === "password") {
    campoSenha.type = "text";
    buttonOcultarExibir.classList.remove("fa-eye");
    buttonOcultarExibir.classList.add("fa-eye-slash");
  } else {
    campoSenha.type = "password";
    buttonOcultarExibir.classList.remove("fa-eye-slash");
    buttonOcultarExibir.classList.add("fa-eye");
  }
}

//
