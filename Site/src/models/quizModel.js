var database = require("../database/config");

function salvarTentativa(idUsuario, acertos, totalPerguntas, pontuacao, percentual, classificacao) {
  var instrucaoSql = `
        INSERT INTO tentativa_quiz (idUsuario, acertos, totalPerguntas, pontuacao, percentual, classificacao)
        VALUES (${idUsuario}, ${acertos}, ${totalPerguntas}, ${pontuacao}, ${percentual}, '${classificacao}');
    `;

  return database.executar(instrucaoSql);
}

function salvarRespostas(idTentativa, respostas) {
  var valores = "";

  for (var i = 0; i < respostas.length; i++) {
    var resposta = respostas[i];
    valores += `(${idTentativa}, ${resposta.idPergunta}, ${resposta.acertou ? 1 : 0}, ${resposta.pontos})`;

    if (i < respostas.length - 1) {
      valores += ", ";
    }
  }

  var instrucaoSql = `
        INSERT INTO resposta_quiz (idTentativa, idPergunta, acertou, pontos)
        VALUES ${valores};
    `;

  return database.executar(instrucaoSql);
}

module.exports = {
  salvarTentativa,
  salvarRespostas,
};
