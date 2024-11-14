//   FUNÇÃO PARA VALIDAR NOME DO USUÁRIO

function validarUserName(inputUserName) {
    let usuarioValido = false;
    const userName = document.getElementById(inputUserName.toString()).value;
    const tamanhoMininoUsuario = 6;
  
    if (userName.length >= tamanhoMininoUsuario) {
      usuarioValido = true;
    }
  
    return usuarioValido;
  }
  
  //
  
  //   FUNÇÃO PARA VALIDAR E-MAIL
  
  function validarEmail(idImputEmail) {
    let containsAt = false,
      containsDotAfterAt = false;
  
    const inputEmail = document.getElementById(`${idImputEmail}`).value;
  
    for (let i = 0, qtdAt = 0, qtdDot = 0; i < inputEmail.length; i++) {
      const char = inputEmail[i];
  
      // VERIFICA SE TEM UM ÚNICO "@" NO E-MAIL DEPOIS DO PRIMEIRO CARACTER
  
      if (char === "@" && inputEmail[0] != "@") {
        qtdAt++;
        if (qtdAt == 1) {
          containsAt = true;
        } else {
          containsAt = false;
          break; // SAI DO LOOP SE ENCONTRAR MAIS DE 1 '@'
        }
      }
  
      // VERIFICA SE TEM UM ÚNICO "." NO E-MAIL DEPOIS DO "@"
  
      if (containsAt && char === ".") {
        qtdDot++;
        if (qtdDot == 1) {
          containsDotAfterAt = true;
        } else {
          containsDotAfterAt = false;
          break; // SAI DO LOOP SE ENCONTRAR MAIS DE 1 '.'
        }
      }
    }
  
    if (containsAt && containsDotAfterAt) {
      return true;
    } else {
      return false;
    }
  }
  
  
  function validarSenha(senha) {
    const possuiNumero = /[0-9]/.test(senha); // Verifica se contém pelo menos um número
    const possuiMaiuscula = /[A-Z]/.test(senha); // Verifica se contém pelo menos uma letra maiúscula
    const possuiCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha); // Verifica se contém pelo menos um caractere especial
  
    if (possuiNumero && possuiMaiuscula && possuiCaractereEspecial) {
      return true; // A senha atende aos requisitos
    } else {
      return false; // A senha não atende aos requisitos
    }
  }
  
  
  //