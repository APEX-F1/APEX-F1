var dashboardModel = require("../models/dashboardModel");

function quiz(req, res) {
  var idUsuario = req.params.idUsuario;

  if (idUsuario == undefined || isNaN(idUsuario)) {
    res.status(400).send("O id do usuário está indefinido ou inválido!");
  } else {
    Promise.all([
      dashboardModel.buscarQuiz(idUsuario),
      dashboardModel.buscarTemas(idUsuario),
    ])
      .then(function (resultados) {
        res.json({
          tentativas: resultados[0],
          porTema: resultados[1],
        });
      })
      .catch(function (erro) {
        console.log(
          "\nHouve um erro ao carregar os dados do quiz! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function erradas(req, res) {
  dashboardModel
    .buscarErradas()
    .then(function (resultado) {
      res.json(resultado);
    })
    .catch(function (erro) {
      console.log(
        "\nHouve um erro ao carregar as perguntas mais erradas! Erro: ",
        erro.sqlMessage
      );
      res.status(500).json(erro.sqlMessage);
    });
}

function simulador(req, res) {
  var idUsuario = req.params.idUsuario;

  if (idUsuario == undefined || isNaN(idUsuario)) {
    res.status(400).send("O id do usuário está indefinido ou inválido!");
  } else {
    dashboardModel
      .buscarSimulador(idUsuario)
      .then(function (resultado) {
        res.json(resultado);
      })
      .catch(function (erro) {
        console.log(
          "\nHouve um erro ao carregar os dados do simulador! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

module.exports = {
  quiz,
  erradas,
  simulador,
};
