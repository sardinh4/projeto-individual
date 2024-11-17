// FUNÇÃO PARA ARMAZENAR NO LOCALSTORAGE A CLASSE DE ESTILO DO BODY DO AUTH.HTML PARA SETAR A CLASSE DO BODY E ATIVAR A ANIMACAO

function setBodyClass(className) {
  
    // Salva a classe no localStorage
    localStorage.setItem('bodyClass', className);

    // Redireciona para a página de cadastro
    window.open('./auth/auth.html', '_blank');
}