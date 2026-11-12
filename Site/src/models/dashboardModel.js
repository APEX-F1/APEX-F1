var database = require("../database/config");

function buscarQuiz(idUsuario) {
  var instrucaoSql = `
        SELECT pontuacao, percentual, classificacao,
               DATE_FORMAT(dataTentativa, '%d/%m/%Y') AS data
        FROM tentativa_quiz
        WHERE idUsuario = ${idUsuario}
        ORDER BY dataTentativa ASC;
    `;

  return database.executar(instrucaoSql);
}

function buscarTemas(idUsuario) {
  var instrucaoSql = `
        SELECT p.categoria AS tema, SUM(r.acertou) AS acertos, COUNT(*) AS total
        FROM resposta_quiz r
        INNER JOIN tentativa_quiz t ON t.idTentativa = r.idTentativa
        INNER JOIN quiz_pergunta p ON p.idPergunta = r.idPergunta
        WHERE t.idUsuario = ${idUsuario}
        GROUP BY p.categoria
        ORDER BY p.categoria ASC;
    `;

  return database.executar(instrucaoSql);
}

function buscarErradas() {
  var instrucaoSql = `
        SELECT p.enunciado, p.categoria AS tema, COUNT(*) AS erros
        FROM resposta_quiz r
        INNER JOIN quiz_pergunta p ON p.idPergunta = r.idPergunta
        WHERE r.acertou = 0
        GROUP BY p.idPergunta, p.enunciado, p.categoria
        ORDER BY erros DESC;
    `;

  return database.executar(instrucaoSql);
}

function buscarSimulador(idUsuario) {
  var instrucaoSql = `
        SELECT gp.nome AS pista, s.posicaoFinal AS posicao, s.pontos,
               DATE_FORMAT(s.dataSimulacao, '%d/%m/%Y') AS data
        FROM simulacao s
        INNER JOIN grande_premio gp ON gp.idGP = s.idGP
        WHERE s.idUsuario = ${idUsuario}
        ORDER BY s.dataSimulacao ASC, s.idSimulacao ASC;
    `;

  return database.executar(instrucaoSql);
}

module.exports = {
  buscarQuiz,
  buscarTemas,
  buscarErradas,
  buscarSimulador,
};
