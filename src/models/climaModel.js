var database = require("../database/config");

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function registrarClima(probChuva, temperaturaMax, umidadeAr, temperaturaMinima) {
  console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", probChuva, temperaturaMax, umidadeAr, temperaturaMinima);
  
  // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
  //  e na ordem de inserção dos dados.
  var instrucaoSql = `
      INSERT INTO clima (probabilidadeDeChuva, temperaturaMaxima, UmidadeDoAr, temperaturaMinima, dtHrColeta) VALUES ('${probChuva}', '${temperaturaMax}', '${umidadeAr}', '${temperaturaMinima}', CURDATE()); `;
  console.log("Executando a instrução SQL- TABELA CLIMA: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  registrarClima
};