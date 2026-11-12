var simuladorModel = require("../models/simuladorModel");

function salvar(req, res) {
  var idUsuario = req.body.idUsuario;
  var idGP = req.body.idGP;
  var etapa = req.body.etapa;
  var pilotoEscolhido = req.body.pilotoEscolhido;
  var numeroCarro = req.body.numeroCarro;
  var posicao = req.body.posicao;
  var pontos = req.body.pontos;
  var tempo = req.body.tempo;

  if (idUsuario == undefined) {
    res.status(400).send("O id do usuário está undefined!");
  } else if (idGP == undefined) {
    res.status(400).send("O id do GP está undefined!");
  } else if (etapa == undefined) {
    res.status(400).send("A etapa está undefined!");
  } else if (pilotoEscolhido == undefined) {
    res.status(400).send("O piloto escolhido está undefined!");
  } else if (posicao == undefined) {
    res.status(400).send("A posição está undefined!");
  } else if (pontos == undefined) {
    res.status(400).send("Os pontos estão undefined!");
  } else if (tempo == undefined) {
    res.status(400).send("O tempo está undefined!");
  } else {
    simuladorModel
      .salvar(
        Number(idUsuario),
        Number(idGP),
        Number(etapa),
        pilotoEscolhido,
        numeroCarro === null || numeroCarro === undefined || numeroCarro === "" ? null : Number(numeroCarro),
        Number(posicao),
        Number(pontos),
        Number(tempo)
      )
      .then(function (resultado) {
        res.json(resultado);
      })
      .catch(function (erro) {
        console.log(
          "\nHouve um erro ao salvar a corrida! Erro: ",
          erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
      });
  }
}

module.exports = {
  salvar,
};
