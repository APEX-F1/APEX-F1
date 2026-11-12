var database = require("../database/config");

function salvar(idUsuario, idGP, etapa, pilotoEscolhido, numeroCarro, posicao, pontos, tempoSegundos) {
  var numero = numeroCarro === null || numeroCarro === undefined || numeroCarro === "" ? "NULL" : numeroCarro;
  var piloto = String(pilotoEscolhido).replace(/'/g, "''");

  var instrucaoSql = `
        INSERT INTO simulacao (idUsuario, idGP, etapa, pilotoEscolhido, numeroCarro, posicaoFinal, pontos, tempoSegundos)
        VALUES (${idUsuario}, ${idGP}, ${etapa}, '${piloto}', ${numero}, ${posicao}, ${pontos}, ${tempoSegundos});
    `;

  return database.executar(instrucaoSql);
}

module.exports = {
  salvar,
};
