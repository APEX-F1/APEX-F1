var quizModel = require("../models/quizModel");

function salvar(req, res) {
  var idUsuario = req.body.idUsuario;
  var pontuacao = req.body.pontuacao;
  var percentual = req.body.percentual;
  var classificacao = req.body.classificacao;
  var respostas = req.body.respostas;

  if (idUsuario == undefined) {
    res.status(400).send("O id do usuário está undefined!");
  } else if (pontuacao == undefined) {
    res.status(400).send("A pontuação está undefined!");
  } else if (percentual == undefined) {
    res.status(400).send("O percentual está undefined!");
  } else if (classificacao == undefined) {
    res.status(400).send("A classificação está undefined!");
  } else if (respostas == undefined || respostas.length == 0) {
    res.status(400).send("As respostas estão undefined!");
  } else {
    var acertos = 0;

    for (var i = 0; i < respostas.length; i++) {
      if (respostas[i].acertou) {
        acertos++;
      }
    }

    var totalPerguntas = respostas.length;

    quizModel
      .salvarTentativa(
        Number(idUsuario),
        acertos,
        totalPerguntas,
        Number(pontuacao),
        Number(percentual),
        classificacao
      )
      .then(function (resultadoTentativa) {
        return quizModel.salvarRespostas(resultadoTentativa.insertId, respostas);
      })
      .then(function (resultadoRespostas) {
        res.json(resultadoRespostas);
      })
      .catch(function (erro) {
        console.log(
          "\nHouve um erro ao salvar o resultado do quiz! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

module.exports = {
  salvar,
};
